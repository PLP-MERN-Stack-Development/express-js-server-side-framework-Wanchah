@echo off
setlocal

:: Smoke test script for Windows cmd
:: Requires curl and PowerShell available in PATH
:: Uses API_KEY environment variable; set it before running:
::   set API_KEY=your_key
::   scripts\smoke-test.cmd

if "%API_KEY%"=="" (
  echo ERROR: API_KEY environment variable is not set.
  echo Set it first, e.g.:
  echo   set API_KEY=2c2832edfef1f7bfe0502959f4c2b03125574a2bf8464c6bbc3e770c577f5cda
  exit /b 1
)

set "URL=http://localhost:3000"
set "OUTDIR=.\scripts"
if not exist "%OUTDIR%" md "%OUTDIR%"

echo Running smoke test against %URL%

echo.
echo 1) Create product
curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer %API_KEY%" -d "{\"name\":\"SmokeTest\",\"description\":\"Smoke test product\",\"price\":1.23,\"category\":\"Test\",\"inStock\":true}" %URL%/api/products -o "%OUTDIR%\resp_create.json"
necho Response:
ntype "%OUTDIR%\resp_create.json"

for /f "usebackq delims=" %%i in (`powershell -NoProfile -Command "(Get-Content '%OUTDIR%\\resp_create.json' | ConvertFrom-Json).id"`) do set "ID=%%i"

if "%ID%"=="" (
  echo Failed to parse ID from create response.
  echo See %OUTDIR%\resp_create.json
  exit /b 1
)
echo Created ID: %ID%
echo.
echo 2) List products
curl -s -H "Authorization: Bearer %API_KEY%" %URL%/api/products -o "%OUTDIR%\resp_list.json"
ntype "%OUTDIR%\resp_list.json"
echo.
echo 3) Update product %ID%
curl -s -X PUT -H "Content-Type: application/json" -H "Authorization: Bearer %API_KEY%" -d "{\"price\":4.50,\"inStock\":false}" %URL%/api/products/%ID% -o "%OUTDIR%\resp_update.json"
necho Update response:
ntype "%OUTDIR%\resp_update.json"
echo.
echo 4) Delete product %ID%
curl -s -X DELETE -H "Authorization: Bearer %API_KEY%" %URL%/api/products/%ID% -o "%OUTDIR%\resp_delete.json"
echo Delete response (may be empty for 204):
ntype "%OUTDIR%\resp_delete.json"
echo.
echo 5) Verify deletion (expect 404)
curl -s -i -H "Authorization: Bearer %API_KEY%" %URL%/api/products/%ID% -o "%OUTDIR%\resp_verify.txt"
ntype "%OUTDIR%\resp_verify.txt"
echo.
echo Smoke test complete.
endlocal
