@echo off
if exist "C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe" (
    start "" "C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe" --app="file:///%~dp0index.html"
) else (
    start "" "%~dp0index.html"
)
