import re
from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, field_validator, ConfigDict

# ==========================================
# Inquiry Schemas
# ==========================================
class InquiryCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=120)
    email: str = Field(..., max_length=120)
    phone: str = Field(..., min_length=5, max_length=50)
    company: Optional[str] = Field(None, max_length=120)
    service_required: str = Field(..., min_length=3, max_length=120)
    project_budget: Optional[str] = Field(None, max_length=80)
    project_description: str = Field(..., min_length=10, max_length=5000)

    @field_validator("full_name")
    def validate_name(cls, v: str) -> str:
        cleaned = v.strip()
        if len(cleaned) < 2:
            raise ValueError("Full name must be at least 2 characters.")
        return cleaned

    @field_validator("email")
    def validate_email_format(cls, v: str) -> str:
        cleaned = v.strip().lower()
        if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", cleaned):
            raise ValueError("Invalid email address format.")
        return cleaned

    @field_validator("phone")
    def validate_phone(cls, v: str) -> str:
        cleaned = v.strip()
        if len(cleaned) < 5:
            raise ValueError("Please provide a valid contact number.")
        return cleaned

    @field_validator("project_description")
    def validate_description(cls, v: str) -> str:
        cleaned = v.strip()
        if len(cleaned) < 10:
            raise ValueError("Project description must be at least 10 characters.")
        return cleaned

class InquiryUpdate(BaseModel):
    status: Optional[str] = Field(None, pattern="^(new|contacted|in_progress|completed|archived)$")
    notes: Optional[str] = Field(None, max_length=5000)

class InquiryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    email: str
    phone: str
    company: Optional[str] = None
    service_required: str
    project_budget: Optional[str] = None
    project_description: str
    status: str
    notes: Optional[str] = None
    created_at: str
    updated_at: str

# ==========================================
# Service Schemas (Strictly No Public Pricing)
# ==========================================
class ServiceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    icon_name: str = "Code"
    tagline: Optional[str] = None
    description: str
    features: List[str] = []
    deliverables: List[str] = []
    order: int = 0

# ==========================================
# Admin Authentication Schemas
# ==========================================
class AdminLoginRequest(BaseModel):
    username_or_email: str = Field(..., min_length=2, max_length=120)
    password: str = Field(..., min_length=4, max_length=128)

class AdminUserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str

class AdminLoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: AdminUserResponse

class DashboardStats(BaseModel):
    total_inquiries: int
    new_inquiries: int
    total_services: int

# ==========================================
# System Schemas
# ==========================================
class HealthResponse(BaseModel):
    status: str
    brand: str
    version: str
    environment: str

class AgencyConfigResponse(BaseModel):
    brand: Dict[str, Any]
    founders: List[Dict[str, Any]]
    contact_info: Dict[str, Any]
