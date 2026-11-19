# ORBIVISION — Render Deployment & Operations Playbook

> **Complete Production Deployment Guide for Render Cloud Infrastructure**  
> Founders: **Om Makwana** (`826458om@gmail.com`) & **Trushal Parmar** (`trushalmparmar96@gmail.com`)

---

## 1. Architecture Overview

ORBIVISION on Render is structured as a decoupled, high-performance cloud application:
1. **Frontend:** Deployed as a **Render Static Site** (React 19 + Vite 8 + Tailwind CSS 4), globally distributed on Render's CDN edge with managed TLS.
2. **Backend:** Deployed as a **Render Web Service** (FastAPI / Python 3.11), sitting behind Render's reverse proxy with automatic health checks.
3. **Database:** SQLite running on a **Render Persistent Disk** mounted at `/app/data/orbivision.db`.
4. **Email Delivery:** Resend SMTP engine configured for automated founder lead alerts and client confirmations.

```mermaid
flowchart TD
    User([Public Visitor / Client])
    
    subgraph RenderCDN ["Render Edge (Managed HTTPS & CDN)"]
        FEdge["Static Site: orbivision-frontend (CDN)"]
        BEdge["Web Service Ingress: orbivision-api"]
    end
    
    subgraph RenderCompute ["Render Cloud Infrastructure"]
        FastAPI["FastAPI Web Service (Python 3.11)"]
        Disk[("Render Persistent Disk (/app/data/orbivision.db)")]
    end
    
    subgraph External ["External Services"]
        Resend["Resend SMTP (smtp.resend.com:587)"]
        Founders["Founder Inboxes (Om & Trushal)"]
    end
    
    User -->|HTTPS :443| FEdge
    User -->|API Calls (VITE_API_BASE_URL)| BEdge
    BEdge --> FastAPI
    FastAPI <--> Disk
    FastAPI -->|STARTTLS :587| Resend
    Resend --> Founders
```

---

## 2. Backend Service Settings (Render Web Service)

Create a **New Web Service** connected to your repository, or use the automated [render.yaml Blueprint](file:///c:/Users/Mahes/Desktop/orbivision/render.yaml).

| Setting | Value | Notes |
| :--- | :--- | :--- |
| **Name** | `orbivision-api` | Name identifier in dashboard |
| **Language / Runtime** | `Python 3` | Python 3.11+ |
| **Region** | `Oregon (US West)` | Choose region closest to your primary audience |
| **Branch** | `master` (or `main`) | Deployment branch |
| **Root Directory** | Leave blank | Root of repository |
| **Build Command** | `cd backend && pip install -r requirements.txt` | Installs pure-Python dependencies |
| **Start Command** | `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT` | Uses Render's dynamic `$PORT` |
| **Plan** | **Starter** ($7/mo) | **Required:** Persistent Disks require a paid plan |
| **Health Check Path**| `/api/health` | Automated uptime monitoring |

---

## 3. Persistent Disk Configuration

Render Web Services are stateless by default. To persist your SQLite database across restarts and deployments, attach a Persistent Disk:

1. In the Web Service dashboard, navigate to **Disks** in the left menu.
2. Click **Add Disk**:
   - **Name:** `orbivision-data`
   - **Mount Path:** `/app/data`
   - **Size:** `1 GB` (sufficient for millions of inquiry records)
3. Save and redeploy.

> [!IMPORTANT]
> The database path is configured via `DATABASE_PATH=/app/data/orbivision.db`. The application automatically verifies that the `/app/data` directory exists upon boot.

---

## 4. Frontend Static Site Settings (Render Static Site)

Create a **New Static Site** connected to your repository:

| Setting | Value | Notes |
| :--- | :--- | :--- |
| **Name** | `orbivision-frontend` | Static site identifier |
| **Branch** | `master` (or `main`) | Deployment branch |
| **Root Directory** | Leave blank | Root of repository |
| **Build Command** | `cd frontend && npm install && npm run build` | Builds optimized client bundle |
| **Publish Directory** | `frontend/dist` | Output build artifacts directory |

### Single Page Application (SPA) Routing Rule

To support client-side routing without 404 errors on sub-routes:
1. Go to **Redirects/Rewrites** in your Static Site dashboard.
2. Add the following rewrite:
   - **Type:** `Rewrite`
   - **Source:** `/*`
   - **Destination:** `/index.html`

---

## 5. Environment Variables Reference

### Backend Web Service Environment Variables

Configure these in **Environment** under your `orbivision-api` service:

| Variable | Value / Description | Required | Example |
| :--- | :--- | :--- | :--- |
| `ENVIRONMENT` | Enforces production mode | Yes | `production` |
| `DATABASE_PATH` | Path on the mounted disk | Yes | `/app/data/orbivision.db` |
| `JWT_SECRET_KEY` | 32+ character random hex key | Yes | `python -c "import secrets; print(secrets.token_hex(32))"` |
| `JWT_ALGORITHM` | RFC-compliant signing algorithm | Yes | `HS256` |
| `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` | Token lifetime (24 hours) | Yes | `1440` |
| `ADMIN_USERNAME` | Production superadmin username | Yes | `admin` |
| `ADMIN_EMAIL` | Admin email address | Yes | `admin@orbivision.com` |
| `ADMIN_PASSWORD` | Strong administrative password | Yes | Set secure 24+ char passphrase |
| `ALLOWED_ORIGINS` | Permitted frontend origins (comma-separated) | Yes | `https://orbivision.onrender.com,https://orbivision.com,https://www.orbivision.com` |
| `SMTP_ENABLED` | Toggle live transactional emails | Yes | `true` |
| `SMTP_HOST` | Resend SMTP endpoint | Yes | `smtp.resend.com` |
| `SMTP_PORT` | Resend port (STARTTLS: 587, SSL: 465) | Yes | `587` |
| `SMTP_USER` | Resend SMTP user | Yes | `resend` (literal string) |
| `SMTP_PASSWORD` | Resend API key | Yes | `re_123456789...` |
| `SMTP_FROM_EMAIL` | Verified sender domain in Resend | Yes | `no-reply@orbivision.com` |
| `SMTP_FROM_NAME` | Sender display name | Yes | `ORBIVISION Agency` |
| `FOUNDER_EMAILS` | Founder notification recipients | Yes | `826458om@gmail.com,trushalmparmar96@gmail.com` |

### Frontend Static Site Environment Variables

Configure in **Environment** under `orbivision-frontend`:

| Variable | Value | Purpose |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `https://orbivision-api.onrender.com` | Points all frontend API calls to your live backend service |

> [!NOTE]
> Vite embeds `VITE_API_BASE_URL` into the compiled JavaScript chunks during the build step. Whenever you change this variable, Render will automatically trigger a new build.

---

## 6. Custom Domain & CORS Setup

### Step 1: Add Custom Domains on Render
1. In `orbivision-frontend`, navigate to **Settings** -> **Custom Domains**.
2. Add `orbivision.com` and `www.orbivision.com`.
3. In your DNS manager (Cloudflare, Namecheap, GoDaddy):
   - Add a `CNAME` record: `www` -> `orbivision-frontend.onrender.com`
   - Add an `ANAME` or `ALIAS` record for the root `@` -> `orbivision-frontend.onrender.com` (or the IP provided by Render).

### Step 2: Configure CORS on Backend
Update `ALLOWED_ORIGINS` in your backend environment to authorize your domains:
```env
ALLOWED_ORIGINS=https://orbivision.onrender.com,https://orbivision.com,https://www.orbivision.com
```

---

## 7. Resend SMTP Configuration

ORBIVISION's notification engine is 100% compatible with Resend:

1. **Create an API Key:**
   - Sign up at [resend.com](https://resend.com).
   - Go to **API Keys** -> **Create API Key** (Permissions: Full Access).
2. **Verify Your Sending Domain:**
   - Go to **Domains** -> **Add Domain** (`orbivision.com`).
   - Add the DKIM and SPF TXT records provided by Resend to your DNS.
3. **Configure Backend Environment:**
   ```env
   SMTP_ENABLED=true
   SMTP_HOST=smtp.resend.com
   SMTP_PORT=587
   SMTP_USER=resend
   SMTP_PASSWORD=re_YourResendApiKeyHere
   SMTP_FROM_EMAIL=inquiries@orbivision.com
   SMTP_FROM_NAME=ORBIVISION Agency
   FOUNDER_EMAILS=826458om@gmail.com,trushalmparmar96@gmail.com
   ```
4. **Behavior:**
   - Client submits inquiry -> In-memory rate limiting checked -> Pydantic validated -> Saved in SQLite.
   - Background worker sends structured alert to Om Makwana and Trushal Parmar.
   - Background worker sends confirmation receipt to client.
   - If Resend is unreachable, the submission HTTP 201 response is **never** blocked, and the lead remains safely in SQLite.

---

## 8. Database Migration to Render Persistent Disk

To migrate your existing local database (including admin users, 12 service capabilities, and existing inquiries) into Render:

### Method 1: Instant Base64 Import (Recommended)

1. On your local machine, run the migration helper:
   ```bash
   python backend/scripts/migrate_db.py --export-base64
   ```
2. Open the **Shell** tab in your Render Web Service dashboard (`orbivision-api`).
3. Paste the generated command:
   ```bash
   mkdir -p /app/data
   cat << 'EOF' | base64 -d > /app/data/orbivision.db
   <BASE64_PAYLOAD>
   EOF
   ```
4. Verify data integrity in the Render Shell:
   ```bash
   python backend/scripts/migrate_db.py --verify-only
   ```
   Expected output:
   ```
   PRAGMA integrity_check: OK
   Admin Users: 1 found
   Active Agency Services: 12 capabilities loaded
   ```

---

## 9. Backup & Disaster Recovery

### Live Hot-Backup on Render
SQLite supports online non-blocking backups without stopping the service.

From the Render Web Service **Shell** tab:
```bash
python -c "
import sqlite3, datetime
src = sqlite3.connect('/app/data/orbivision.db')
bck = sqlite3.connect(f'/app/data/backup_{datetime.datetime.now().strftime(\"%Y%m%d_%H%M%S\")}.db')
src.backup(bck)
bck.close()
src.close()
print('Hot backup created successfully')
"
```

### Download Database from Render to Local Machine
In Render Shell:
```bash
base64 /app/data/orbivision.db
```
Copy the base64 string, and on your local machine:
```bash
echo "<COPIED_BASE64>" | base64 -d > orbivision_backup.db
```
Verify the downloaded backup locally:
```bash
python backend/scripts/migrate_db.py --db orbivision_backup.db --verify-only
```
