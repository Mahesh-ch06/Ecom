# Database Setup Helper
# This script will help you set up your Supabase database

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  HOSTEL SNACK SHOP - DATABASE SETUP" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "ERROR DETECTED: Tables don't exist yet!" -ForegroundColor Red
Write-Host ""
Write-Host "Let's fix this by creating the database tables..." -ForegroundColor Yellow
Write-Host ""

# Read the complete SQL file
$sqlFile = "COMPLETE_DATABASE_SETUP.sql"
if (Test-Path $sqlFile) {
    $sqlContent = Get-Content $sqlFile -Raw
    
    # Copy to clipboard
    $sqlContent | Set-Clipboard
    
    Write-Host "[OK] Complete SQL copied to clipboard!" -ForegroundColor Green
    Write-Host ""
    Write-Host "The SQL includes:" -ForegroundColor White
    Write-Host "  - Creates 3 tables (products, orders, order_items)" -ForegroundColor Gray
    Write-Host "  - Sets up security policies (RLS)" -ForegroundColor Gray
    Write-Host "  - Adds performance indexes" -ForegroundColor Gray
    Write-Host "  - Includes 6 sample products" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host "[ERROR] SQL file not found!" -ForegroundColor Red
    Write-Host "Please make sure COMPLETE_DATABASE_SETUP.sql exists" -ForegroundColor Yellow
    Write-Host ""
    Pause
    exit
}

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  NEXT STEPS:" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. I'll open Supabase SQL Editor in your browser" -ForegroundColor White
Write-Host "2. Click the '+ New Query' button" -ForegroundColor White
Write-Host "3. Press Ctrl+V to paste the SQL" -ForegroundColor White
Write-Host "4. Click 'RUN' (or press Ctrl+Enter)" -ForegroundColor White
Write-Host "5. Wait for 'Success. No rows returned' message" -ForegroundColor White
Write-Host "6. Refresh your website: http://localhost:5173/" -ForegroundColor White
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

$response = Read-Host "Ready to open Supabase? (Y/N)"
if ($response -eq "Y" -or $response -eq "y") {
    Write-Host ""
    Write-Host "Opening Supabase SQL Editor..." -ForegroundColor Green
    Start-Sleep -Seconds 1
    Start-Process "https://supabase.com/dashboard/project/wysdzeapploexrldqqlm/sql/new"
    Write-Host ""
    Write-Host "[OK] Browser opened!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Remember: The SQL is already copied to your clipboard!" -ForegroundColor Yellow
    Write-Host "Just press Ctrl+V in the SQL Editor and click RUN" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "No problem! You can manually go to:" -ForegroundColor Yellow
    Write-Host "https://supabase.com/dashboard/project/wysdzeapploexrldqqlm/sql/new" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Need detailed instructions? Check SETUP_DATABASE.md" -ForegroundColor Gray
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
