$ErrorActionPreference = "Continue"

$reportFile = "django_verification_report.txt"
$python = "..\venv\Scripts\python.exe"

"DJANGO VERIFICATION REPORT" | Out-File -FilePath $reportFile
"==========================" | Out-File -FilePath $reportFile -Append
"" | Out-File -FilePath $reportFile -Append

"Phase 1: Environment Check" | Out-File -FilePath $reportFile -Append
& $python --version | Out-File -FilePath $reportFile -Append
"" | Out-File -FilePath $reportFile -Append

"Phase 2: Code Quality" | Out-File -FilePath $reportFile -Append
& $python -m ruff check . 2>&1 | Out-File -FilePath $reportFile -Append
& $python -m black . --check 2>&1 | Out-File -FilePath $reportFile -Append
& $python -m isort . --check-only 2>&1 | Out-File -FilePath $reportFile -Append
"" | Out-File -FilePath $reportFile -Append

"Phase 3: Migrations" | Out-File -FilePath $reportFile -Append
& $python manage.py makemigrations --check 2>&1 | Out-File -FilePath $reportFile -Append
"" | Out-File -FilePath $reportFile -Append

"Phase 4: Tests + Coverage" | Out-File -FilePath $reportFile -Append
& $python -m pytest --cov=main_app --cov-report=term-missing 2>&1 | Out-File -FilePath $reportFile -Append
"" | Out-File -FilePath $reportFile -Append

"Phase 5: Security Scan" | Out-File -FilePath $reportFile -Append
& $python manage.py check --deploy 2>&1 | Out-File -FilePath $reportFile -Append
& $python -m bandit -r . 2>&1 | Out-File -FilePath $reportFile -Append
& $python -m safety check 2>&1 | Out-File -FilePath $reportFile -Append
"" | Out-File -FilePath $reportFile -Append

"Phase 6: Django Commands" | Out-File -FilePath $reportFile -Append
& $python manage.py check --database default 2>&1 | Out-File -FilePath $reportFile -Append
"" | Out-File -FilePath $reportFile -Append

"Verification complete. Check $reportFile."
