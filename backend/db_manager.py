import sqlite3
import json
import datetime
from datetime import timezone
from contextlib import contextmanager
from typing import List, Optional, Dict, Any

import config

@contextmanager
def get_db_cursor():
    """
    Context manager for database connections and transactions.
    Automatically commits on success, rolls back on exception,
    and guarantees connection closing to prevent any leaks.
    """
    conn = sqlite3.connect(config.DATABASE_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    try:
        with conn:
            cursor = conn.cursor()
            yield cursor
    finally:
        conn.close()

def init_db():
    """Create all required tables with optimized indexes."""
    with get_db_cursor() as cursor:
        # Inquiries Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS inquiries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            company TEXT,
            service_required TEXT NOT NULL,
            project_budget TEXT,
            project_description TEXT NOT NULL,
            status TEXT DEFAULT 'new',
            notes TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
        """)
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at)")

        # Services Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS services (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            icon_name TEXT DEFAULT 'Code',
            tagline TEXT,
            description TEXT NOT NULL,
            features TEXT DEFAULT '[]',
            deliverables TEXT DEFAULT '[]',
            pricing_tier TEXT,
            is_active INTEGER DEFAULT 1,
            service_order INTEGER DEFAULT 0
        )
        """)

        # Admin Users Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS admin_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT DEFAULT 'admin',
            created_at TEXT NOT NULL
        )
        """)

        # Projects Table (preserved for admin archival; no public endpoints)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            category TEXT NOT NULL,
            client_name TEXT,
            year TEXT DEFAULT '2025',
            short_description TEXT NOT NULL,
            full_description TEXT,
            image_url TEXT NOT NULL,
            live_url TEXT,
            github_url TEXT,
            tech_stack TEXT DEFAULT '[]',
            metrics TEXT DEFAULT '[]',
            featured INTEGER DEFAULT 0,
            is_demo INTEGER DEFAULT 1,
            project_order INTEGER DEFAULT 0,
            created_at TEXT NOT NULL
        )
        """)

# ==========================================
# Inquiries Operations
# ==========================================
def insert_inquiry(data: dict) -> dict:
    now = datetime.datetime.now(timezone.utc).isoformat()
    with get_db_cursor() as cursor:
        cursor.execute("""
            INSERT INTO inquiries (
                full_name, email, phone, company, service_required,
                project_budget, project_description, status, notes,
                created_at, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data["full_name"],
            data["email"],
            data["phone"],
            data.get("company"),
            data["service_required"],
            data.get("project_budget"),
            data["project_description"],
            "new",
            None,
            now,
            now
        ))
        inquiry_id = cursor.lastrowid
        cursor.execute("SELECT * FROM inquiries WHERE id = ?", (inquiry_id,))
        row = dict(cursor.fetchone())
        return row

def get_inquiries(
    status_filter: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 50,
    offset: int = 0
) -> List[dict]:
    query = "SELECT * FROM inquiries"
    conditions = []
    params = []

    if status_filter and status_filter.lower() != "all":
        conditions.append("status = ?")
        params.append(status_filter.lower())

    if search and search.strip():
        term = f"%{search.strip()}%"
        conditions.append("(full_name LIKE ? OR email LIKE ? OR phone LIKE ? OR company LIKE ? OR service_required LIKE ?)")
        params.extend([term, term, term, term, term])

    if conditions:
        query += " WHERE " + " AND ".join(conditions)

    query += " ORDER BY id DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])

    with get_db_cursor() as cursor:
        cursor.execute(query, tuple(params))
        return [dict(r) for r in cursor.fetchall()]

def count_inquiries(status_filter: Optional[str] = None, search: Optional[str] = None) -> int:
    query = "SELECT COUNT(*) FROM inquiries"
    conditions = []
    params = []

    if status_filter and status_filter.lower() != "all":
        conditions.append("status = ?")
        params.append(status_filter.lower())

    if search and search.strip():
        term = f"%{search.strip()}%"
        conditions.append("(full_name LIKE ? OR email LIKE ? OR phone LIKE ? OR company LIKE ? OR service_required LIKE ?)")
        params.extend([term, term, term, term, term])

    if conditions:
        query += " WHERE " + " AND ".join(conditions)

    with get_db_cursor() as cursor:
        cursor.execute(query, tuple(params))
        return cursor.fetchone()[0]

def update_inquiry(inquiry_id: int, status: Optional[str] = None, notes: Optional[str] = None) -> Optional[dict]:
    now = datetime.datetime.now(timezone.utc).isoformat()
    fields = ["updated_at = ?"]
    params = [now]

    if status is not None:
        fields.append("status = ?")
        params.append(status)
    if notes is not None:
        fields.append("notes = ?")
        params.append(notes)

    params.append(inquiry_id)
    query = f"UPDATE inquiries SET {', '.join(fields)} WHERE id = ?"

    with get_db_cursor() as cursor:
        cursor.execute(query, tuple(params))
        cursor.execute("SELECT * FROM inquiries WHERE id = ?", (inquiry_id,))
        row = cursor.fetchone()
        return dict(row) if row else None

def delete_inquiry(inquiry_id: int) -> bool:
    with get_db_cursor() as cursor:
        cursor.execute("DELETE FROM inquiries WHERE id = ?", (inquiry_id,))
        return cursor.rowcount > 0

# ==========================================
# Services Operations
# ==========================================
def get_services() -> List[dict]:
    """Retrieve active services with strictly no public pricing returned."""
    with get_db_cursor() as cursor:
        cursor.execute("SELECT * FROM services WHERE is_active = 1 ORDER BY service_order ASC, id ASC")
        rows = cursor.fetchall()
        results = []
        for r in rows:
            d = dict(r)
            d["features"] = json.loads(d["features"] or "[]")
            d["deliverables"] = json.loads(d["deliverables"] or "[]")
            d["order"] = d.pop("service_order", 0)
            # Guarantee pricing is removed from public payload
            d.pop("pricing_tier", None)
            d.pop("is_active", None)
            results.append(d)
        return results

def insert_service(s: dict) -> int:
    with get_db_cursor() as cursor:
        cursor.execute("""
            INSERT INTO services (title, icon_name, tagline, description, features, deliverables, pricing_tier, is_active, service_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            s["title"],
            s.get("icon_name", "Code"),
            s.get("tagline"),
            s["description"],
            json.dumps(s.get("features", [])),
            json.dumps(s.get("deliverables", [])),
            None,  # No pricing tier
            1 if s.get("is_active", True) else 0,
            s.get("order", 0)
        ))
        return cursor.lastrowid

# ==========================================
# Admin Operations
# ==========================================
def get_admin_by_username_or_email(identifier: str) -> Optional[dict]:
    with get_db_cursor() as cursor:
        cursor.execute("SELECT * FROM admin_users WHERE username = ? OR email = ?", (identifier, identifier))
        row = cursor.fetchone()
        return dict(row) if row else None

def get_admin_by_id(user_id: int) -> Optional[dict]:
    with get_db_cursor() as cursor:
        cursor.execute("SELECT * FROM admin_users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        return dict(row) if row else None

def insert_admin(user: dict) -> int:
    now = datetime.datetime.now(timezone.utc).isoformat()
    with get_db_cursor() as cursor:
        cursor.execute("""
            INSERT INTO admin_users (username, email, password_hash, role, created_at)
            VALUES (?, ?, ?, ?, ?)
        """, (
            user["username"],
            user["email"],
            user["password_hash"],
            user.get("role", "admin"),
            now
        ))
        return cursor.lastrowid

def update_admin_password_hash(admin_id: int, new_password_hash: str) -> bool:
    with get_db_cursor() as cursor:
        cursor.execute("UPDATE admin_users SET password_hash = ? WHERE id = ?", (new_password_hash, admin_id))
        return cursor.rowcount > 0

def get_stats() -> dict:
    with get_db_cursor() as cursor:
        cursor.execute("SELECT COUNT(*) FROM inquiries")
        total_inquiries = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM inquiries WHERE status = 'new'")
        new_inquiries = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM services WHERE is_active = 1")
        total_services = cursor.fetchone()[0]

        return {
            "total_inquiries": total_inquiries,
            "new_inquiries": new_inquiries,
            "total_services": total_services,
        }
