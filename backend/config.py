import os
from pathlib import Path
from dotenv import load_dotenv

# Search for .env in current directory or parent directory
BASE_DIR = Path(__file__).resolve().parent
PARENT_DIR = BASE_DIR.parent

if (BASE_DIR / ".env").exists():
    load_dotenv(BASE_DIR / ".env")
elif (PARENT_DIR / ".env").exists():
    load_dotenv(PARENT_DIR / ".env")
else:
    load_dotenv()

# Server Settings
HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", "8000"))
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

# Security & JWT
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
if not JWT_SECRET_KEY:
    if ENVIRONMENT == "production":
        raise RuntimeError("CRITICAL: JWT_SECRET_KEY environment variable is missing in production!")
    # Secure random ephemeral key for development if not provided
    JWT_SECRET_KEY = "orbivision-dev-secret-key-change-in-production-only"

JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

# Database
DATABASE_PATH = os.getenv("DATABASE_PATH", str(BASE_DIR / "orbivision.db"))

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

# Initial Admin Credentials
INITIAL_ADMIN_USERNAME = os.getenv("INITIAL_ADMIN_USERNAME", "admin")
INITIAL_ADMIN_EMAIL = os.getenv("INITIAL_ADMIN_EMAIL", "admin@orbivision.com")
INITIAL_ADMIN_PASSWORD = os.getenv("INITIAL_ADMIN_PASSWORD", "Orbivision@2025")
