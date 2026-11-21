#!/usr/bin/env python3
"""
ORBIVISION — SQLite Database Migration & Verification Utility for Render

This script inspects, verifies, and exports the SQLite database for migration
to the Render Persistent Disk (/app/data/orbivision.db).

Usage:
    python backend/scripts/migrate_db.py [--export-base64] [--verify-only]
"""

import sys
import os
import sqlite3
import argparse
import base64
from pathlib import Path

# Add backend directory to sys.path
SCRIPT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = SCRIPT_DIR.parent
sys.path.insert(0, str(BACKEND_DIR))

import config

def verify_database(db_path: Path):
    """Verify table schema, record integrity, and presence of critical agency data."""
    if not db_path.exists():
        print(f"❌ Database not found at: {db_path}")
        return False

    print(f"🔍 Inspecting database: {db_path} ({db_path.stat().st_size} bytes)")
    
    conn = sqlite3.connect(str(db_path))
    cur = conn.cursor()

    # 1. SQLite internal integrity check
    cur.execute("PRAGMA integrity_check;")
    integrity = cur.fetchone()[0]
    if integrity != "ok":
        print(f"❌ Integrity check failed: {integrity}")
        conn.close()
        return False
    print("✅ PRAGMA integrity_check: OK")

    # 2. Check Admin Users
    try:
        cur.execute("SELECT id, username, email, role, password_hash FROM admin_users;")
        admins = cur.fetchall()
        print(f"✅ Admin Users: {len(admins)} found")
        for a in admins:
            is_bcrypt = a[4].startswith(("$2b$", "$2a$"))
            print(f"   • Admin ID #{a[0]}: '{a[1]}' ({a[2]}) | Role: {a[3]} | Bcrypt Hashed: {is_bcrypt}")
    except Exception as e:
        print(f"❌ Error checking admin_users: {e}")

    # 3. Check Services
    try:
        cur.execute("SELECT count(*) FROM services WHERE is_active = 1;")
        service_count = cur.fetchone()[0]
        print(f"✅ Active Agency Services: {service_count} capabilities loaded")
    except Exception as e:
        print(f"❌ Error checking services: {e}")

    # 4. Check Inquiries
    try:
        cur.execute("SELECT count(*), max(id) FROM inquiries;")
        inq_row = cur.fetchone()
        print(f"✅ Inquiries: {inq_row[0]} leads stored (Latest ID: {inq_row[1]})")
    except Exception as e:
        print(f"❌ Error checking inquiries: {e}")

    conn.close()
    return True

import datetime

def create_backup(db_path: Path) -> Path:
    """Create a verified, timestamped online backup of the SQLite database."""
    if not db_path.exists():
        raise FileNotFoundError(f"Database not found at {db_path}")

    backup_dir = BACKEND_DIR / "backups"
    backup_dir.mkdir(parents=True, exist_ok=True)
    
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_file = backup_dir / f"orbivision_backup_{timestamp}.db"

    src = sqlite3.connect(str(db_path))
    dst = sqlite3.connect(str(backup_file))
    with dst:
        src.backup(dst)
    dst.close()
    src.close()

    # Verify backup integrity
    conn = sqlite3.connect(str(backup_file))
    cur = conn.cursor()
    cur.execute("PRAGMA integrity_check;")
    status = cur.fetchone()[0]
    conn.close()

    if status != "ok":
        backup_file.unlink(missing_ok=True)
        raise RuntimeError(f"Backup verification failed: {status}")

    print(f"🔒 Verified local backup created: {backup_file} ({backup_file.stat().st_size} bytes)")
    return backup_file

def export_base64(db_path: Path):
    """
    Export the database to a gitignored local Base64 file and display secure transfer instructions.
    NOTE: In adherence to strict security rules, raw Base64 data is NEVER printed to stdout/logs.
    """
    if not db_path.exists():
        print(f"❌ Error: {db_path} does not exist.")
        return

    # First, guarantee a verified backup exists
    backup_file = create_backup(db_path)

    backup_dir = BACKEND_DIR / "backups"
    payload_file = backup_dir / "migration_payload.b64"

    with open(db_path, "rb") as f:
        data = f.read()
    
    encoded = base64.b64encode(data).decode("ascii")
    with open(payload_file, "w", encoding="ascii") as f:
        f.write(encoded)
    
    print("\n" + "=" * 70)
    print("🚀 SECURE RENDER PERSISTENT DISK MIGRATION INSTRUCTIONS")
    print("=" * 70)
    print(f"1. A verified local backup has been saved to: {backup_file.name}")
    print(f"2. Migration payload generated: {payload_file.name} (protected in gitignored /backups/)")
    print("3. In your Render Web Service dashboard ('orbivision-api'), click 'Shell'.")
    print("4. In Render Shell, ensure the mount path exists:")
    print("   mkdir -p /app/data")
    print("5. To transfer the payload securely without exposing raw data in chat or logs:")
    print(f"   Option A (Render Shell): Copy content from local '{payload_file.name}' and pipe:")
    print("   cat << 'EOF' | base64 -d > /app/data/orbivision.db")
    print("   <PASTE_LOCAL_FILE_CONTENT>")
    print("   EOF")
    print("6. Verify data integrity in Render Shell:")
    print("   python -c \"import sqlite3; conn = sqlite3.connect('/app/data/orbivision.db'); print('Integrity:', conn.execute('PRAGMA integrity_check;').fetchall()); print('Services:', conn.execute('SELECT count(*) FROM services').fetchone()[0])\"")
    print("=" * 70)

def main():
    parser = argparse.ArgumentParser(description="ORBIVISION Database Migration Tool for Render")
    parser.add_argument("--db", type=str, default=config.DATABASE_PATH, help="Path to SQLite database")
    parser.add_argument("--export-base64", action="store_true", help="Generate Base64 migration payload")
    parser.add_argument("--create-backup", action="store_true", help="Create a local verified backup in backend/backups/")
    parser.add_argument("--verify-only", action="store_true", help="Run integrity verification only")
    
    args = parser.parse_args()
    db_path = Path(args.db)

    success = verify_database(db_path)
    if not success:
        sys.exit(1)

    if args.create_backup:
        create_backup(db_path)
    elif args.export_base64:
        export_base64(db_path)
    else:
        print("\n💡 Run with --export-base64 to generate the one-click Render Shell migration command.")

if __name__ == "__main__":
    main()
