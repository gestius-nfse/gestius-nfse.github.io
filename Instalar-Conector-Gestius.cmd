@echo off
setlocal
title Instalar o conector Gestius NFS-e
set "DESTINO=%LOCALAPPDATA%\Gestius NFS-e Conector"
set "PACOTE=https://gestius-nfse.github.io/conector/conector.zip"
echo.
echo  ==========================================================
echo   GESTIUS NFS-e - instalacao do conector
echo   Instale no computador que tem os certificados digitais.
echo  ==========================================================
echo.

rem ---- 1. Node.js (componente que roda o conector) ----
set "NODE="
for %%x in (node.exe) do if not "%%~$PATH:x"=="" set "NODE=%%~$PATH:x"
if not defined NODE if exist "%ProgramFiles%\nodejs\node.exe" set "NODE=%ProgramFiles%\nodejs\node.exe"
if not defined NODE (
  echo [1/4] Instalando o Node.js...
  winget install --id OpenJS.NodeJS.LTS -e --silent --accept-source-agreements --accept-package-agreements
  if exist "%ProgramFiles%\nodejs\node.exe" set "NODE=%ProgramFiles%\nodejs\node.exe"
)
if not defined NODE (
  echo Nao foi possivel instalar o Node.js automaticamente.
  echo Instale pelo site nodejs.org ^(versao LTS^) e rode este arquivo de novo.
  pause & exit /b 1
)
for %%d in ("%NODE%") do set "NODEDIR=%%~dpd"
echo [1/4] Node.js ok.

rem ---- 2. Baixar o conector (para o anterior, se houver) ----
echo [2/4] Baixando o conector...
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 37420 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }" >nul 2>nul
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; [Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; $z=Join-Path $env:TEMP 'gestius-conector.zip'; Invoke-WebRequest -UseBasicParsing '%PACOTE%' -OutFile $z; New-Item -ItemType Directory -Force '%DESTINO%' | Out-Null; Expand-Archive -Force $z '%DESTINO%'; Remove-Item $z"
if errorlevel 1 ( echo Falha ao baixar. Confira a internet e tente de novo. & pause & exit /b 1 )

rem ---- 3. Componentes ----
echo [3/4] Preparando...
pushd "%DESTINO%"
call "%NODEDIR%npm.cmd" install --omit=dev --no-audit --no-fund --loglevel=error
if errorlevel 1 ( popd & echo Falha ao preparar os componentes. & pause & exit /b 1 )
> conector.cmd echo @echo off
>> conector.cmd echo cd /d "%%~dp0"
>> conector.cmd echo set PORT=37420
>> conector.cmd echo set CONECTOR=1
>> conector.cmd echo if not exist dados mkdir dados
>> conector.cmd echo "%NODE%" server.js ^>^> dados\conector.log 2^>^&1
popd

rem ---- 4. Abrir junto com o Windows (escondido) e iniciar agora ----
echo [4/4] Ligando o conector...
powershell -NoProfile -Command "$s=(New-Object -ComObject WScript.Shell).CreateShortcut([Environment]::GetFolderPath('Startup')+'\Gestius NFS-e Conector.lnk'); $s.TargetPath=$env:WINDIR+'\System32\wscript.exe'; $s.Arguments='\"%DESTINO%\conector.vbs\"'; $s.WorkingDirectory='%DESTINO%'; $s.Save()"
start "" wscript.exe "%DESTINO%\conector.vbs"
timeout /t 5 /nobreak >nul
start "" "https://gestius-nfse.github.io/#conectar"
echo.
echo  Pronto! O conector esta ligado e vai abrir sozinho com o Windows.
echo  No site, clique em "Conectar este computador".
echo  Se o navegador perguntar sobre "acesso a rede local", clique em Permitir.
echo.
pause
