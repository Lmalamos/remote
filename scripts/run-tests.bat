@echo off
REM ============================================
REM TEST EXECUTION HELPER SCRIPTS (Windows)
REM ============================================

echo.
echo 🎭 Playwright Test Runner
echo ========================
echo.

if "%1"=="smoke" (
    echo 🔥 Running smoke tests...
    npx playwright test --grep "@smoke"
    goto end
)

if "%1"=="regression" (
    echo 🔄 Running regression tests...
    npx playwright test --grep "@regression"
    goto end
)

if "%1"=="api" (
    echo 🌐 Running API tests...
    npx playwright test --grep "@api"
    goto end
)

if "%1"=="visual" (
    echo 👁️ Running visual regression tests...
    npx playwright test --grep "@visual"
    goto end
)

if "%1"=="fast" (
    echo ⚡ Running fast tests only...
    npx playwright test --grep "@fast"
    goto end
)

if "%1"=="critical" (
    echo 🔴 Running critical (P0) tests...
    npx playwright test --grep "@p0"
    goto end
)

if "%1"=="chrome" (
    echo 🌐 Running tests on Chrome...
    npx playwright test --project=chromium
    goto end
)

if "%1"=="firefox" (
    echo 🦊 Running tests on Firefox...
    npx playwright test --project=firefox
    goto end
)

if "%1"=="webkit" (
    echo 🧭 Running tests on WebKit...
    npx playwright test --project=webkit
    goto end
)

if "%1"=="all" (
    echo 🚀 Running all tests...
    npx playwright test
    goto end
)

if "%1"=="ci" (
    echo 🤖 Running CI test suite...
    set CI=true
    npx playwright test --project=chromium --grep "@smoke|@p0"
    goto end
)

if "%1"=="report" (
    echo 📊 Opening test report...
    npx playwright show-report
    goto end
)

echo Usage: %0 {smoke^|regression^|api^|visual^|fast^|critical^|chrome^|firefox^|webkit^|all^|ci^|report}
echo.
echo Examples:
echo   %0 smoke     - Run smoke tests
echo   %0 api       - Run API tests
echo   %0 chrome    - Run tests on Chrome
echo   %0 ci        - Run CI test suite
echo   %0 report    - Open test report
exit /b 1

:end
if %errorlevel% equ 0 (
    echo.
    echo ✅ Tests completed successfully!
) else (
    echo.
    echo ❌ Tests failed!
)
exit /b %errorlevel%
