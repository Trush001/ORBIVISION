import os
from pathlib import Path
from dotenv import load_dotenv

# Search for .env in current directory or parent directory
BASE_DIR = Path(__file__).resolve().parent
PARENT_DIR = BASE_DIR.parent

# Load .env: loads root workspace .env first, then backend/.env if present
if (PARENT_DIR / ".env").exists():
    load_dotenv(PARENT_DIR / ".env", override=True)
if (BASE_DIR / ".env").exists():
    load_dotenv(BASE_DIR / ".env", override=True)

# Server Settings
HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", "8000"))
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

# Security & JWT
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
INSECURE_KEYS = {
    "your-super-secret-jwt-key-change-this-in-production",
    "orbivision-dev-secret-key-change-in-production-only",
    "orbivision-ultra-secure-agency-secret-key-2025",
}

if ENVIRONMENT == "production":
    if not JWT_SECRET_KEY or JWT_SECRET_KEY in INSECURE_KEYS or len(JWT_SECRET_KEY) < 32:
        raise RuntimeError(
            "CRITICAL SECURITY CONFIGURATION ERROR: A strong, unique JWT_SECRET_KEY of at least 32 characters must be set in production!"
        )
elif not JWT_SECRET_KEY:
    # Ephemeral key for local development only
    JWT_SECRET_KEY = "orbivision-dev-secret-key-change-in-production-only"

JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

# Database Path Resolution:
# Supports absolute paths (e.g. Docker volumes) and resolves relative paths
# strictly against BASE_DIR to ensure deterministic SQLite database binding.
raw_db_path = os.getenv("DATABASE_PATH", "orbivision.db")
if os.path.isabs(raw_db_path):
    DATABASE_PATH = raw_db_path
else:
    DATABASE_PATH = str((BASE_DIR / raw_db_path).resolve())

# CORS
raw_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000"
)
ALLOWED_ORIGINS = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

# Notifications & SMTP
SMTP_ENABLED = os.getenv("SMTP_ENABLED", "false").lower() in ("true", "1", "yes")
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SMTP_FROM_EMAIL = os.getenv("SMTP_FROM_EMAIL", "no-reply@orbivision.com")
SMTP_FROM_NAME = os.getenv("SMTP_FROM_NAME", "ORBIVISION Agency")

# Founder Notification Recipients
raw_founders = os.getenv("FOUNDER_EMAILS", "826458om@gmail.com,trushalmparmar96@gmail.com")
FOUNDER_EMAILS = [email.strip() for email in raw_founders.split(",") if email.strip()]

# Trusted Reverse Proxies (comma-separated list of IPs, CIDR blocks, or hostnames)
# Forwarded client IP headers (X-Forwarded-For, X-Real-IP) are ONLY trusted from these sources.
raw_trusted_proxies = os.getenv(
    "TRUSTED_PROXIES",
    "127.0.0.1,::1,localhost,testclient,172.16.0.0/12,10.0.0.0/8,192.168.0.0/16"
)
TRUSTED_PROXIES = [p.strip() for p in raw_trusted_proxies.split(",") if p.strip()]

# Admin Credentials Configuration
# Loaded strictly from environment variables; NEVER hardcoded in source code.
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", os.getenv("INITIAL_ADMIN_USERNAME", "admin"))
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", os.getenv("INITIAL_ADMIN_EMAIL", "admin@orbivision.com"))
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", os.getenv("INITIAL_ADMIN_PASSWORD", ""))

# Backward-compatibility aliases for existing imports
INITIAL_ADMIN_USERNAME = ADMIN_USERNAME
INITIAL_ADMIN_EMAIL = ADMIN_EMAIL
INITIAL_ADMIN_PASSWORD = ADMIN_PASSWORD
