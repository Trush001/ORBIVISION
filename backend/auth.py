import datetime
from datetime import timezone
import hmac
import hashlib
from typing import Optional, Tuple
from fastapi import Header, HTTPException, status
import bcrypt
import jwt

import config
import db_manager

def hash_password(password: str) -> str:
    """Securely hash a password using bcrypt with automatic salting."""
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, stored_hash: str) -> Tuple[bool, bool]:
    """
    Verify password against stored hash.
    Returns (is_valid, needs_rehash).
    Supports bcrypt and transparently validates legacy salted SHA-256 hashes
    so existing databases can be seamlessly upgraded to bcrypt on login.
    """
    if not stored_hash or not plain_password:
        return False, False

    # Check for Bcrypt format ($2a$, $2b$, $2y$)
    if stored_hash.startswith(("$2a$", "$2b$", "$2y$")):
        try:
            is_valid = bcrypt.checkpw(plain_password.encode("utf-8"), stored_hash.encode("utf-8"))
            return is_valid, False
        except Exception:
            return False, False

    # Fallback check for legacy salted SHA-256 format (salt$hash)
    if "$" in stored_hash:
        try:
            salt, expected_hash = stored_hash.split("$", 1)
            actual_hash = hashlib.sha256((salt + plain_password).encode("utf-8")).hexdigest()
            if hmac.compare_digest(expected_hash, actual_hash):
                # Valid legacy password, flag for re-hashing with bcrypt
                return True, True
        except Exception:
            return False, False

    return False, False

def create_access_token(data: dict, expires_minutes: Optional[int] = None) -> str:
    """Generate a standard signed JWT access token."""
    to_encode = data.copy()
    expire_delta = expires_minutes or config.JWT_ACCESS_TOKEN_EXPIRE_MINUTES
    now = datetime.datetime.now(timezone.utc)
    expire = now + datetime.timedelta(minutes=expire_delta)

    to_encode.update({
        "exp": expire,
        "iat": now,
    })

    encoded_jwt = jwt.encode(
        to_encode,
        config.JWT_SECRET_KEY,
        algorithm=config.JWT_ALGORITHM
    )
    return encoded_jwt

def decode_access_token(token: str) -> dict:
    """Verify and decode a JWT access token."""
    try:
        payload = jwt.decode(
            token,
            config.JWT_SECRET_KEY,
            algorithms=[config.JWT_ALGORITHM]
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token has expired. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_admin(authorization: Optional[str] = Header(None)) -> dict:
    """FastAPI Dependency: Authenticate admin user from Bearer token."""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header is required.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    parts = authorization.split(" ")
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header must follow format: Bearer <token>",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = parts[1]
    payload = decode_access_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload: missing subject.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db_manager.get_admin_by_id(int(user_id))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Administrative user not found or deactivated.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user
