import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Dict, Any, List

import config

logger = logging.getLogger("orbivision.notifications")

def send_smtp_email(to_addresses: List[str], subject: str, text_body: str, html_body: str = None) -> bool:
    """Send an email using standard SMTP. Returns True on success, False on failure."""
    if not config.SMTP_ENABLED or not config.SMTP_USER or not config.SMTP_PASSWORD:
        logger.info(f"[NOTIFICATION SIMULATION] SMTP not enabled. Email to {to_addresses} recorded in logs:\nSubject: {subject}\n{text_body}")
        return True

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{config.SMTP_FROM_NAME} <{config.SMTP_FROM_EMAIL}>"
        msg["To"] = ", ".join(to_addresses)

        part_text = MIMEText(text_body, "plain", "utf-8")
        msg.attach(part_text)

        if html_body:
            part_html = MIMEText(html_body, "html", "utf-8")
            msg.attach(part_html)

        use_ssl = getattr(config, "SMTP_USE_SSL", False) or config.SMTP_PORT == 465
        if use_ssl:
            with smtplib.SMTP_SSL(config.SMTP_HOST, config.SMTP_PORT, timeout=10) as server:
                server.login(config.SMTP_USER, config.SMTP_PASSWORD)
                server.sendmail(config.SMTP_FROM_EMAIL, to_addresses, msg.as_string())
        else:
            with smtplib.SMTP(config.SMTP_HOST, config.SMTP_PORT, timeout=10) as server:
                server.ehlo()
                server.starttls()
                server.ehlo()
                server.login(config.SMTP_USER, config.SMTP_PASSWORD)
                server.sendmail(config.SMTP_FROM_EMAIL, to_addresses, msg.as_string())

        logger.info(f"Successfully dispatched notification to {to_addresses}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {to_addresses}: {e}", exc_info=True)
        return False

def notify_founders_of_inquiry(inquiry: Dict[str, Any]):
    """Background task: Send an alert to Om Makwana and Trushal Parmar."""
    inquiry_id = inquiry.get("id", "N/A")
    full_name = inquiry.get("full_name", "N/A")
    email = inquiry.get("email", "N/A")
    phone = inquiry.get("phone", "N/A")
    company = inquiry.get("company") or "Individual / Not Provided"
    service = inquiry.get("service_required", "N/A")
    scope = inquiry.get("project_budget") or "Custom Scope"
    description = inquiry.get("project_description", "N/A")
    created_at = inquiry.get("created_at", "N/A")

    subject = f"⚡ New Lead Alert: #{inquiry_id} from {full_name} ({service})"
    
    text_body = f"""ORBIVISION — NEW PROJECT INQUIRY ALERT
=============================================
Inquiry ID:          #{inquiry_id}
Submission Time:     {created_at}

CLIENT INFORMATION:
-------------------
Full Name:           {full_name}
Email Address:       {email}
Phone / WhatsApp:    {phone}
Company:             {company}

PROJECT DETAILS:
----------------
Service Required:    {service}
Project Scope/Type:  {scope}

Description:
{description}

=============================================
Direct Response Hotlines:
Om Makwana:       +91 9426231338 | 826458om@gmail.com
Trushal Parmar:   +91 8733070464 | trushalmparmar96@gmail.com
"""

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0c0c10; color: #e2e8f0; padding: 20px; }}
        .card {{ max-width: 600px; margin: 0 auto; background: #161622; border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 12px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }}
        .header {{ border-bottom: 1px solid #2d2d3f; padding-bottom: 15px; margin-bottom: 20px; }}
        .brand {{ color: #8b5cf6; font-size: 20px; font-weight: bold; letter-spacing: 1px; }}
        .tag {{ display: inline-block; padding: 4px 10px; background: rgba(56, 189, 248, 0.15); color: #38bdf8; border-radius: 6px; font-size: 12px; font-weight: 600; margin-top: 5px; }}
        .row {{ margin-bottom: 12px; }}
        .label {{ color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }}
        .val {{ color: #ffffff; font-size: 15px; font-weight: 500; margin-top: 2px; }}
        .desc-box {{ background: #0e0e15; border-left: 3px solid #8b5cf6; padding: 15px; border-radius: 6px; margin-top: 15px; color: #cbd5e1; line-height: 1.5; font-size: 14px; }}
        .footer {{ margin-top: 25px; padding-top: 15px; border-top: 1px solid #2d2d3f; font-size: 12px; color: #64748b; text-align: center; }}
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="brand">ORBI<span style="color:#38bdf8;">VISION</span></div>
          <div class="tag">NEW INQUIRY #{inquiry_id}</div>
        </div>

        <div class="row">
          <div class="label">Client Name</div>
          <div class="val">{full_name}</div>
        </div>

        <div class="row">
          <div class="label">Contact Email & Phone</div>
          <div class="val"><a href="mailto:{email}" style="color:#a78bfa; text-decoration:none;">{email}</a> &bull; <a href="tel:{phone}" style="color:#38bdf8; text-decoration:none;">{phone}</a></div>
        </div>

        <div class="row">
          <div class="label">Company</div>
          <div class="val">{company}</div>
        </div>

        <div class="row">
          <div class="label">Service Required</div>
          <div class="val" style="color:#38bdf8;">{service}</div>
        </div>

        <div class="row">
          <div class="label">Project Scope</div>
          <div class="val">{scope}</div>
        </div>

        <div class="label" style="margin-top:15px;">Project Brief / Description</div>
        <div class="desc-box">{description}</div>

        <div class="footer">
          Received on {created_at} &bull; ORBIVISION Automated Notification Engine
        </div>
      </div>
    </body>
    </html>
    """

    send_smtp_email(config.FOUNDER_EMAILS, subject, text_body, html_body)

def send_client_confirmation(inquiry: Dict[str, Any]):
    """Background task: Send an automated professional confirmation to the client."""
    client_email = inquiry.get("email")
    if not client_email:
        return

    full_name = inquiry.get("full_name", "Valued Client")
    subject = "Thank you for contacting ORBIVISION"

    text_body = f"""Dear {full_name},

Thank you for contacting ORBIVISION.
We have successfully received your project inquiry. Our team will review your requirements and get in touch with you soon.

We appreciate your interest in working with us.

Warm regards,
Team ORBIVISION
Om Makwana & Trushal Parmar
Digital Solutions & Creative Technology
Website: https://orbivision.com
"""

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0c0c10; color: #e2e8f0; padding: 20px; }}
        .card {{ max-width: 580px; margin: 0 auto; background: #161622; border: 1px solid rgba(139, 92, 246, 0.25); border-radius: 12px; padding: 35px; }}
        .brand {{ color: #8b5cf6; font-size: 22px; font-weight: bold; margin-bottom: 20px; }}
        p {{ color: #cbd5e1; line-height: 1.6; font-size: 15px; margin-bottom: 16px; }}
        .highlight {{ color: #ffffff; font-weight: 600; }}
        .footer {{ margin-top: 30px; padding-top: 20px; border-top: 1px solid #2d2d3f; font-size: 13px; color: #64748b; }}
      </style>
    </head>
    <body>
      <div class="card">
        <div class="brand">ORBI<span style="color:#38bdf8;">VISION</span></div>
        <p>Dear <span class="highlight">{full_name}</span>,</p>
        <p>Thank you for contacting <strong>ORBIVISION</strong>.</p>
        <p>We have successfully received your project inquiry. Our founders (Om Makwana &amp; Trushal Parmar) and team will review your requirements and get in touch with you soon.</p>
        <p>We appreciate your interest in working with us.</p>
        <div class="footer">
          <strong>Team ORBIVISION</strong><br>
          Digital Solutions &amp; Creative Technology Agency<br>
          Om Makwana (+91 9426231338) &bull; Trushal Parmar (+91 8733070464)
        </div>
      </div>
    </body>
    </html>
    """

    send_smtp_email([client_email], subject, text_body, html_body)
