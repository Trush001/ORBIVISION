import time
from collections import defaultdict
from threading import Lock
from typing import Dict, List, Tuple
from fastapi import Request, HTTPException, status

class InMemoryRateLimiter:
    """
    Thread-safe in-memory sliding-window rate limiter.
    Does not require external Redis or binary dependencies.
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

def get_client_ip(request: Request) -> str:
    """Extract client IP, taking into account common reverse proxy headers."""
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip.strip()
    return request.client.host if request.client else "unknown"

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
