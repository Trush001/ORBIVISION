# ORBIVISION — Premium Digital Technology & Creative Solutions Agency

> **"WE BUILD DIGITAL EXPERIENCES THAT MOVE BUSINESSES FORWARD."**  
> Operated by **Om Makwana** & **Trushal Parmar**.

---

## 🚀 Quick Start & Development

### Method 1: Unified Workspace Launcher (Recommended)
You can launch both frontend and backend concurrently from the workspace root:
```bash
# 1. Install dependencies
npm install
cd frontend && npm install && cd ..
pip install -r backend/requirements.txt

# 2. Launch both servers with one command
npm run dev
```

- **Frontend Application:** [http://127.0.0.1:5173/](http://127.0.0.1:5173/)
- **Backend API:** [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
- **Interactive Swagger Docs:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **API Health Check:** [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)

### Method 2: Docker Compose (Production Ready with HTTPS & Certbot)
```bash
docker compose up --build
```
- **Edge Gateway:** High-performance Nginx Alpine terminating TLS on port `443` with automatic HTTP-to-HTTPS redirect on port `80`.
- **Backend API:** FastAPI isolated inside the internal Docker bridge network (`orbivision-network`), unreachable directly from public internet.
- **Certbot Daemon:** Automated Let's Encrypt renewal loop every 12 hours.
- See [DEPLOYMENT.md](file:///c:/Users/Mahes/Desktop/orbivision/DEPLOYMENT.md) for full DNS, firewall, SSL bootstrapping, and reverse-proxy documentation.

### Method 3: Windows Shell Scripts
- Run `run_servers.ps1` in PowerShell, or double-click `run_servers.bat`.

---

## 🛡️ Security Architecture & Upgrades

1. **Bcrypt Password Security:** Single-round SHA-256 has been replaced with salted **Bcrypt (12 rounds)**. Existing database passwords are automatically verified and upgraded upon login.
2. **Environment-Driven JWT:** Token signing uses RFC-compliant `PyJWT` with 256-bit keys loaded strictly from `.env` (`JWT_SECRET_KEY`).
3. **Zero Credentials in Frontend:** Initial state for administrative login is completely blank; no passwords or secret tokens exist in the client bundle.
4. **Strict CORS Policy:** Wildcard `*` origins combined with credentials have been eliminated in favor of explicit domain authorization (`ALLOWED_ORIGINS`).
5. **Rate Limiting:** Sliding-window in-memory rate limiting shields sensitive routes:
   - `POST /api/admin/login`: Max 5 attempts per minute per IP.
   - `POST /api/inquiries`: Max 3 submissions per 10 minutes per IP.
6. **Security Headers:** Automatic `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection`, and `Referrer-Policy` response headers.

---

## 📬 Automated Client Inquiry & Notification Engine

When a client submits the project inquiry form:
1. **Validation & Sanitization:** Pydantic v2 validates full name, email format, phone, and project description (minimum 10 characters).
2. **Database Persistence:** The inquiry is committed to SQLite using thread-safe context management.
3. **Founder Alert:** An asynchronous background task dispatches structured lead details (client name, contact info, scope, brief, and timestamp) to both founders:
   - **Om Makwana:** `826458om@gmail.com`
   - **Trushal Parmar:** `trushalmparmar96@gmail.com`
4. **Client Receipt:** The client receives an automated confirmation acknowledging receipt and promising a response within 2 hours.
5. **Fault-Tolerant Delivery:** Any network or SMTP delivery error is logged without failing the client's HTTP response or rolling back database records.

---

## ⚡ Performance Optimizations

- **Component Code Splitting:** `React.lazy()` and `Suspense` isolate the heavy Three.js canvas and 700+ line `AdminDashboard` modal.
- **Bundle Size Reduction:** Main JavaScript chunk reduced from **888 kB down to 334 kB** (99 kB gzipped).
- **Zero WebGL Leaks:** `Hero3DCanvas.jsx` disposes all geometries, materials, particles, and WebGL contexts upon unmount, preventing GPU memory bloat.
- **Offline Fallback Dataset:** The services showcase renders instantaneously from local static constants (`constants.js`) and hydrates from the API when available.
- **Zero Linter Warnings:** Clean Oxlint pass with 0 warnings and 0 errors.

---

## 👥 Founders & Direct Contact Channels

### **Om Makwana**
- **Role:** Co-founder | Digital Solutions & Development
- **Focus:** High-conversion web architectures, responsive frontends, interactive Three.js/GSAP experiences, and UI/UX systems.
- **Phone:** `+91 9426231338`
- **Email:** `826458om@gmail.com`
- **WhatsApp:** Direct one-click chat pre-configured on site (`https://wa.me/919426231338`)

### **Trushal Parmar**
- **Role:** Co-founder | AI, Backend & Full-Stack Development
- **Focus:** Autonomous AI agents, LLM integrations (Gemini, OpenAI), FastAPI microservices, n8n automation, and resilient database architectures.
- **Phone:** `+91 8733070464`
- **Email:** `trushalmparmar96@gmail.com`
- **WhatsApp:** Direct one-click chat pre-configured on site (`https://wa.me/918733070464`)

---

## 🛠️ Complete Services (12 Capabilities)
1. **Website Design & Development**
2. **Full-Stack Web Development**
3. **Custom Web Applications**
4. **Android & iOS App Development**
5. **AI Automation & AI Integration**
6. **Business Process Automation**
7. **UI/UX Design**
8. **Graphic Design & Branding**
9. **E-commerce Website Development**
10. **API Development & Integration**
11. **Custom Software Solutions**
12. **Digital Consultation**

---

## 🧪 Testing & Verification

```bash
# Run backend test suite (Unit + Integration tests)
npm run test

# Run Oxlint static analysis
npm run lint

# Run production Vite build
npm run build
```
