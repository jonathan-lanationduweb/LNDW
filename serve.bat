@echo off
REM ============================================================
REM  Lance le serveur local DEPUIS LE DOSSIER PARENT (obligatoire)
REM  pour que les assets ../LNDW SITE/image/assets/... se chargent.
REM  Double-clique ce fichier, puis ouvre l'URL affichee.
REM ============================================================
cd /d "%~dp0\.."
echo.
echo  Serveur lance depuis : %CD%
echo  Ouvre :  http://localhost:8123/lndw-code/la-nation.html
echo.
start "" "http://localhost:8123/lndw-code/la-nation.html"
python -m http.server 8123 --bind 127.0.0.1
