# Quick Fix Script for Products Table Policies
# This script will help you apply the SQL fix to your Supabase database

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  Supabase Products Table Policy Fix" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "The issue: Your products table is missing INSERT/UPDATE/DELETE policies." -ForegroundColor Yellow
Write-Host ""

Write-Host "To fix this, you need to run SQL commands in your Supabase dashboard." -ForegroundColor White
Write-Host ""

Write-Host "STEP 1: Copy the SQL below" -ForegroundColor Green
Write-Host "------------------------------------------------------------------------" -ForegroundColor Gray

$sqlContent = @"
-- Fix Products Table Policies
CREATE POLICY "Anyone can insert products"
  ON products FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update products"
  ON products FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete products"
  ON products FOR DELETE
  USING (true);

CREATE POLICY "Anyone can update orders"
  ON orders FOR UPDATE
  USING (true)
  WITH CHECK (true);
"@

Write-Host $sqlContent -ForegroundColor White
Write-Host "------------------------------------------------------------------------" -ForegroundColor Gray
Write-Host ""

# Copy to clipboard
$sqlContent | Set-Clipboard
Write-Host "✓ SQL copied to clipboard!" -ForegroundColor Green
Write-Host ""

Write-Host "STEP 2: Go to your Supabase dashboard" -ForegroundColor Green
Write-Host "   URL: https://supabase.com/dashboard/project/wysdzeapploexrldqqlm" -ForegroundColor Cyan
Write-Host ""

Write-Host "STEP 3: Navigate to SQL Editor (left sidebar)" -ForegroundColor Green
Write-Host ""

Write-Host "STEP 4: Click '+ New Query'" -ForegroundColor Green
Write-Host ""

Write-Host "STEP 5: Paste the SQL (Ctrl+V) and click 'Run'" -ForegroundColor Green
Write-Host ""

Write-Host "STEP 6: After successful run, refresh your website" -ForegroundColor Green
Write-Host ""

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Need more help? Check FIX_PRODUCTS_ISSUE.md" -ForegroundColor Yellow
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Offer to open browser
$response = Read-Host "Open Supabase dashboard in browser? (Y/N)"
if ($response -eq 'Y' -or $response -eq 'y') {
    Start-Process "https://supabase.com/dashboard/project/wysdzeapploexrldqqlm/sql/new"
    Write-Host "✓ Opening browser..." -ForegroundColor Green
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
