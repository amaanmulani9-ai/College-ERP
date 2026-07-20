@echo off
echo =======================================================
echo College ERP - Windows Setup Script
echo =======================================================

echo.
echo [1/4] Checking for Microsoft C++ Build Tools (cl.exe)...
where cl.exe >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] cl.exe not found!
    echo The machine learning libraries (numpy, chromadb) may fail to install
    echo if you are using a Python version that does not have pre-built binaries (like Python 3.13+).
    echo If pip installation fails, please install "Desktop development with C++" from Visual Studio Installer.
    echo.
) else (
    echo [OK] C++ compiler found.
)

echo.
echo [2/4] Activating Virtual Environment...
if not exist "venv\Scripts\activate.bat" (
    echo [INFO] Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate.bat

echo.
echo [3/4] Upgrading Pip...
python -m pip install --upgrade pip

echo.
echo [4/4] Installing Requirements...
pip install -r requirements.txt

echo.
echo =======================================================
echo Setup Complete!
echo You can now run: python manage.py migrate
echo =======================================================
pause
