import time
import ipaddress
from collections import defaultdict
from threading import Lock
from typing import Dict, List, Tuple
from fastapi import Request, HTTPException, status
import config

class InMemoryRateLimiter:
    """
    Thread-safe in-memory sliding-window rate limiter.
    
    LIMITATION NOTE (Single-Instance vs Multi-Instance):
    - In-memory state is local to this Python worker process.
    - If deployed across multiple Uvicorn workers, containers, or servers behind
      a round-robin load balancer, rate limit quotas are per-instance rather than
      globally shared.
    - For distributed/multi-instance deployments, see the Redis migration pattern
      documented below and in DEPLOYMENT.md.
    """
    def __init__(self):
        self._requests: Dict[str, List[float]] = defaultdict(list)
        self._lock = Lock()

    def check_rate_limit(self, key: str, max_requests: int, window_seconds: int) -> Tuple[bool, int]:
        """
        Check if key has exceeded max_requests within window_seconds.
        Returns (is_allowed, retry_after_seconds).
        """
        now = time.time()
        window_start = now - window_seconds

        with self._lock:
            # Filter out timestamps outside window
            timestamps = [t for t in self._requests[key] if t > window_start]
            self._requests[key] = timestamps

            if len(timestamps) >= max_requests:
                earliest = timestamps[0]
                retry_after = max(1, int(window_seconds - (now - earliest)))
                return False, retry_after

            self._requests[key].append(now)
            return True, 0

    def cleanup(self, max_age_seconds: int = 3600):
        """Purge stale IP records to prevent memory growth over long periods."""
        now = time.time()
        with self._lock:
            stale_keys = [
                key for key, times in self._requests.items()
                if not times or (now - times[-1]) > max_age_seconds
            ]
            for key in stale_keys:
                del self._requests[key]

# Singleton limiter instance
limiter = InMemoryRateLimiter()

def is_trusted_proxy(peer_ip: str) -> bool:
    """
    Verify whether the immediate network peer is in the configured TRUSTED_PROXIES list.
    Supports IPv4, IPv6, CIDR blocks, and hostnames/test identifiers.
    """
    if not peer_ip or peer_ip == "unknown":
        return False
    try:
        peer_addr = ipaddress.ip_address(peer_ip)
        for trusted in config.TRUSTED_PROXIES:
            try:
                if "/" in trusted:
                    if peer_addr in ipaddress.ip_network(trusted, strict=False):
                        return True
                else:
                    if peer_addr == ipaddress.ip_address(trusted):
                        return True
            except ValueError:
                if trusted.lower() == peer_ip.lower():
                    return True
    except ValueError:
        # Hostnames or test client names (e.g., 'localhost', 'testclient')
        return peer_ip.lower() in [t.lower() for t in config.TRUSTED_PROXIES]
    return False

def is_valid_ip(ip_str: str) -> bool:
    """Validate whether a candidate string is a valid IPv4 or IPv6 address."""
    if not ip_str:
        return False
    try:
        ipaddress.ip_address(ip_str.strip())
        return True
    except ValueError:
        return False

def get_client_ip(request: Request) -> str:
    """
    Extract client IP securely across both Render cloud infrastructure and Docker/VPS self-hosted environments.
    
    SECURITY MEASURES:
    1. Render Deployment (config.IS_RENDER is True):
       Render Web Services operate behind Render's edge reverse proxy and Cloudflare ingress.
       Public clients cannot connect directly to the service container port; all traffic passes
       through Render's edge. Cloudflare sets and sanitizes 'CF-Connecting-IP' and 'True-Client-IP'.
       We extract and strictly validate the client IP format from 'CF-Connecting-IP', 'True-Client-IP',
       or the leftmost entry of 'X-Forwarded-For'.
       
    2. Self-Hosted / Docker / Local Deployments (config.IS_RENDER is False):
       Forwarded headers (X-Forwarded-For, X-Real-IP) are ONLY trusted if the immediate network
       connection peer (request.client.host) is an explicitly verified trusted reverse proxy
       (in TRUSTED_PROXIES). Direct public clients attempting to spoof X-Forwarded-For are thwarted
       because their forwarded headers are ignored and their raw socket IP is used.
    """
    peer_ip = request.client.host if request.client else "unknown"

    # Case 1: Operating in Render Cloud Environment
    if config.IS_RENDER:
        cf_ip = request.headers.get("CF-Connecting-IP")
        if cf_ip:
            candidate = cf_ip.split(",")[0].strip()
            if is_valid_ip(candidate):
                return candidate

        true_ip = request.headers.get("True-Client-IP")
        if true_ip:
            candidate = true_ip.split(",")[0].strip()
            if is_valid_ip(candidate):
                return candidate

        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            candidate = forwarded.split(",")[0].strip()
            if is_valid_ip(candidate):
                return candidate

        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            candidate = real_ip.split(",")[0].strip()
            if is_valid_ip(candidate):
                return candidate

        return peer_ip

    # Case 2: Self-hosted / Docker / Local environments
    # Reject forwarded headers if immediate connection peer is not an authorized trusted proxy
    if not is_trusted_proxy(peer_ip):
        return peer_ip

    # Peer is a verified trusted proxy: extract originating client IP
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        client_candidate = forwarded.split(",")[0].strip()
        if is_valid_ip(client_candidate):
            return client_candidate

    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        client_candidate = real_ip.strip()
        if is_valid_ip(client_candidate):
            return client_candidate

    return peer_ip

def rate_limit_login(request: Request):
    """Rate limit admin login: max 5 requests per 60 seconds per IP."""
    ip = get_client_ip(request)
    allowed, retry_after = limiter.check_rate_limit(f"login:{ip}", max_requests=5, window_seconds=60)
    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Too many login attempts. Please wait {retry_after} seconds before trying again.",
            headers={"Retry-After": str(retry_after)}
        )

def rate_limit_inquiry(request: Request):
    """Rate limit inquiry submissions: max 3 requests per 600 seconds (10 mins) per IP."""
    ip = get_client_ip(request)
    allowed, retry_after = limiter.check_rate_limit(f"inquiry:{ip}", max_requests=3, window_seconds=600)
    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Submission limit reached. Please wait {retry_after} seconds before submitting another inquiry.",
            headers={"Retry-After": str(retry_after)}
        )
