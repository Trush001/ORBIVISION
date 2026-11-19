Write-Host "Starting ORBIVISION Full-Stack Agency Platform..." -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor DarkGray

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev -- --host 127.0.0.1 --port 5173"

Write-Host "Both servers launched successfully!" -ForegroundColor Green
Write-Host "Frontend: http://127.0.0.1:5173/" -ForegroundColor Yellow
Write-Host "Backend:  http://127.0.0.1:8000/" -ForegroundColor Yellow
Write-Host "Docs:     http://127.0.0.1:8000/docs" -ForegroundColor Yellow
