"""
ORBIVISION Models Module
Consolidated to Pydantic schemas in schemas.py for single source of truth.
"""
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

__all__ = [
    "InquiryCreate",
    "InquiryUpdate",
    "InquiryResponse",
    "ServiceResponse",
    "AdminLoginRequest",
    "AdminLoginResponse",
    "AdminUserResponse",
    "DashboardStats",
    "HealthResponse",
    "AgencyConfigResponse",
]
