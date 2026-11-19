from contextlib import asynccontextmanager
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, Query, Request, Response, BackgroundTasks, status
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

import config
import db_manager
from auth import verify_password, hash_password, create_access_token, get_current_admin
from seed_data import seed_database, FOUNDERS
from rate_limiter import rate_limit_login, rate_limit_inquiry
from notifications import notify_founders_of_inquiry, send_client_confirmation
from schemas import (
    InquiryCreate,
    InquiryUpdate,
    InquiryResponse,
    ServiceResponse,
    AdminLoginRequest,
    AdminLoginResponse,
    AdminUserResponse,
    DashboardStats,
    HealthResponse,
    AgencyConfigResponse,
)

import logging

logger = logging.getLogger("orbivision.app")

# Lifespan event handler for startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database schema and verify seed data
    seed_database()

    # Verify notification service readiness
    if not config.SMTP_ENABLED or not config.SMTP_USER or not config.SMTP_PASSWORD:
        logger.warning("=====================================================================")
        logger.warning("⚠️  ORBIVISION NOTIFICATION ENGINE: Live SMTP is NOT configured.")
        logger.warning("   Inquiries will be safely persisted in SQLite, but email alerts")
        logger.warning("   will execute in SIMULATION (local logging) mode.")
        logger.warning("   To enable real email dispatch, set SMTP_ENABLED=true in .env.")
        logger.warning("=====================================================================")
    else:
        logger.info(f"✅ ORBIVISION NOTIFICATION ENGINE: Live SMTP enabled via {config.SMTP_HOST}:{config.SMTP_PORT}")

    yield

app = FastAPI(
    title="ORBIVISION Agency API",
    description="High-performance, secure backend API for ORBIVISION Creative Technology Agency",
    version="2.0.0",
    lifespan=lifespan
)

# Security Headers Middleware
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        if config.ENVIRONMENT == "production":
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response

app.add_middleware(SecurityHeadersMiddleware)

# Explicit, Secure CORS Configuration (No wildcard with credentials)
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["Retry-After"],
)

# ----------------- Public Agency Endpoints -----------------

@app.get("/api/health", response_model=HealthResponse)
def health_check():
    """Service health telemetry check."""
    return {
        "status": "online",
        "brand": "ORBIVISION",
        "version": "2.0.0",
        "environment": config.ENVIRONMENT
    }

@app.get("/api/config", response_model=AgencyConfigResponse)
def get_agency_config():
    """Public brand metadata, verified founder channels, and agency identity."""
    return {
        "brand": {
            "name": "ORBIVISION",
            "tagline": "WE BUILD DIGITAL EXPERIENCES THAT MOVE BUSINESSES FORWARD.",
            "description": "From powerful websites and mobile applications to intelligent AI automation, we transform ideas into digital solutions that make a difference.",
            "available_for_hire": True,
            "founded_year": "2024",
            "location": "Global / Remote & India",
            "response_time": "< 2 hours",
        },
        "founders": FOUNDERS,
        "contact_info": {
            "om": {
                "name": "Om Makwana",
                "role": "Co-founder | Digital Solutions & Development",
                "phone": "+91 9426231338",
                "email": "826458om@gmail.com",
                "whatsapp": "https://wa.me/919426231338"
            },
            "trushal": {
                "name": "Trushal Parmar",
                "role": "Co-founder | AI, Backend & Full-Stack Development",
                "phone": "+91 8733070464",
                "email": "trushalmparmar96@gmail.com",
                "whatsapp": "https://wa.me/918733070464"
            }
        }
    }

@app.get("/api/services", response_model=List[ServiceResponse])
def list_services():
    """Retrieve full agency service capabilities with strictly no public pricing."""
    return db_manager.get_services()

@app.post(
    "/api/inquiries",
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(rate_limit_inquiry)]
)
def submit_inquiry(inquiry: InquiryCreate, background_tasks: BackgroundTasks):
    """
    Submit client project inquiry with rate limiting, database persistence,
    and asynchronous dual-notification engine (founders alert + client receipt).
    """
    created = db_manager.insert_inquiry(inquiry.model_dump())

    # Schedule asynchronous notifications via BackgroundTasks
    background_tasks.add_task(notify_founders_of_inquiry, created)
    background_tasks.add_task(send_client_confirmation, created)

    return {
        "success": True,
        "message": "Inquiry submitted successfully! Om Makwana and Trushal Parmar will review your requirements and respond shortly.",
        "inquiry": created
    }

# ----------------- Admin Management Endpoints -----------------

@app.post(
    "/api/admin/login",
    response_model=AdminLoginResponse,
    dependencies=[Depends(rate_limit_login)]
)
def admin_login(creds: AdminLoginRequest):
    """
    Secure admin authentication with bcrypt verification,
    automatic legacy SHA-256 password migration, and signed JWT issuance.
    """
    user = db_manager.get_admin_by_username_or_email(creds.username_or_email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )

    is_valid, needs_rehash = verify_password(creds.password, user["password_hash"])
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )

    # Automatic upgrade from legacy SHA-256 to modern bcrypt on successful login
    if needs_rehash:
        new_hash = hash_password(creds.password)
        db_manager.update_admin_password_hash(user["id"], new_hash)

    token = create_access_token({"sub": str(user["id"]), "username": user["username"], "role": user["role"]})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": AdminUserResponse(
            id=user["id"],
            username=user["username"],
            email=user["email"],
            role=user["role"]
        )
    }

@app.get("/api/admin/stats", response_model=DashboardStats)
def get_dashboard_stats(current_admin: dict = Depends(get_current_admin)):
    """Administrative analytics and inquiry counts."""
    return db_manager.get_stats()

@app.get("/api/inquiries", response_model=List[InquiryResponse])
def get_all_inquiries(
    status_filter: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_admin: dict = Depends(get_current_admin)
):
    """Retrieve inquiry leads with status filtering, keyword search, and pagination."""
    return db_manager.get_inquiries(
        status_filter=status_filter,
        search=search,
        limit=limit,
        offset=offset
    )

@app.patch("/api/inquiries/{inquiry_id}", response_model=InquiryResponse)
def update_inquiry(
    inquiry_id: int,
    update_data: InquiryUpdate,
    current_admin: dict = Depends(get_current_admin)
):
    """Update lead workflow status (new, contacted, in_progress, completed, archived) or internal notes."""
    updated = db_manager.update_inquiry(
        inquiry_id,
        status=update_data.status,
        notes=update_data.notes
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return updated

@app.delete("/api/inquiries/{inquiry_id}")
def delete_inquiry(
    inquiry_id: int,
    current_admin: dict = Depends(get_current_admin)
):
    """Permanently delete an inquiry record."""
    success = db_manager.delete_inquiry(inquiry_id)
    if not success:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return {"message": "Inquiry deleted successfully"}
