#!/usr/bin/env python3
"""
ORBIVISION — Safe SMTP Delivery Verification Tool
Allows operators to test SMTP handshake and credentials without spamming real clients.

Usage:
    python verify_smtp.py
    python verify_smtp.py --to my-test-email@example.com
"""

import sys
import smtplib
import argparse
from email.mime.text import MIMEText

import config

def verify_smtp_connection(test_recipient: str = None) -> bool:
    print("=" * 65)
    print("ORBIVISION — SMTP & Notification Delivery Diagnostic")
    print("=" * 65)
    print(f"SMTP Enabled:      {config.SMTP_ENABLED}")
    print(f"SMTP Host:         {config.SMTP_HOST}:{config.SMTP_PORT}")
    print(f"SMTP User:         {config.SMTP_USER or '(not configured)'}")
    print(f"From Address:      {config.SMTP_FROM_EMAIL}")
    print(f"Configured Leads:  {', '.join(config.FOUNDER_EMAILS)}")
    print("-" * 65)

    if not config.SMTP_ENABLED:
        print("STATUS: PENDING / SIMULATION MODE")
        print("Note: SMTP_ENABLED is false in .env. Real email delivery is disabled.")
        print("Inquiries will be safely stored in the database, and lead notifications")
        print("will be logged to standard server logs without attempting SMTP connections.")
        print("=" * 65)
        return False

    if not config.SMTP_USER or not config.SMTP_PASSWORD:
        print("STATUS: FAIL — Incomplete Credentials")
        print("ERROR: SMTP_ENABLED is true, but SMTP_USER or SMTP_PASSWORD is empty in .env.")
        print("=" * 65)
        return False

    print("Step 1: Connecting to SMTP server...")
    try:
        with smtplib.SMTP(config.SMTP_HOST, config.SMTP_PORT, timeout=10) as server:
            server.ehlo()
            print("Step 2: Upgrading to TLS encryption (STARTTLS)...")
            server.starttls()
            server.ehlo()
            print("Step 3: Authenticating with credentials...")
            server.login(config.SMTP_USER, config.SMTP_PASSWORD)
            print("STATUS: PASS — SMTP Authentication Handshake Successful!")

            if test_recipient:
                print(f"Step 4: Dispatching isolated test message to: {test_recipient}...")
                msg = MIMEText(
                    "This is an automated diagnostic test from ORBIVISION Agency.\n"
                    "If you received this message, your SMTP credentials and delivery pipeline are working correctly.\n\n"
                    "Team ORBIVISION",
                    "plain",
                    "utf-8"
                )
                msg["Subject"] = "🧪 ORBIVISION — SMTP Delivery Diagnostic Test"
                msg["From"] = f"{config.SMTP_FROM_NAME} <{config.SMTP_FROM_EMAIL}>"
                msg["To"] = test_recipient

                server.sendmail(config.SMTP_FROM_EMAIL, [test_recipient], msg.as_string())
                print(f"STATUS: PASS — Test email successfully delivered to {test_recipient}!")
            else:
                print("Skipping message dispatch (pass --to <email> to test live inbox delivery).")

            print("=" * 65)
            return True

    except Exception as e:
        print(f"STATUS: FAIL — SMTP connection failed: {e}")
        print("=" * 65)
        return False

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Verify ORBIVISION SMTP credentials")
    parser.add_argument("--to", help="Optional test email recipient to verify live delivery")
    args = parser.parse_args()

    success = verify_smtp_connection(test_recipient=args.to)
    sys.exit(0 if success or not config.SMTP_ENABLED else 1)
