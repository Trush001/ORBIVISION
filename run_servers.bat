@echo off
echo Starting ORBIVISION Full-Stack Agency Platform...
echo ==================================================
start "ORBIVISION Backend (FastAPI)" cmd /k "cd backend && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"
timeout /t 2 /nobreak >nul
start "ORBIVISION Frontend (Vite)" cmd /k "cd frontend && npm run dev -- --host 127.0.0.1 --port 5173"
echo.
echo Both servers are launching!
echo Frontend: http://127.0.0.1:5173/
echo Backend:  http://127.0.0.1:8000/
echo Swagger:  http://127.0.0.1:8000/docs
echo ==================================================
pause
