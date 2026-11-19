"""
ORBIVISION Database Module
Consolidated to use robust, zero-DLL SQLite implementation via db_manager.
"""
from db_manager import get_db_cursor, init_db

__all__ = ["get_db_cursor", "init_db"]
