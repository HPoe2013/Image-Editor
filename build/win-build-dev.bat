@ECHO OFF

SETLOCAL enabledelayedexpansion

ECHO Building Project (Development)...
CD ..

ECHO:
ECHO Cleaning directory...
DEL /F/S/Q "dist\*"

ECHO:
ECHO Building Toolkit file...
CALL :build_toolkit_file

ECHO:
ECHO Webpacking front end scripts...
CALL node_modules\.bin\webpack --config ./build/webpack/dev.config.js

ECHO:
ECHO Copying other files to dist...
COPY .\www\index.html .\dist\www\index.html /Y
ROBOCOPY .\www\styles .\dist\www\styles /S /NJS /NJH /NC /NDL /NS /NP
ROBOCOPY .\www\images .\dist\www\images /S /NJS /NJH /NC /NDL /NS /NP

ECHO:
ECHO Development build finished at: %time%
EXIT /B 0

:build_toolkit_file
CD .\www\scripts\tools
ECHO // GENERATED SCRIPT FILE > toolkit.js

SET exStr=module.exports = {

FOR /r %%i in (*) DO (
	IF "%%~ni" NEQ "toolkit" (
		SET exStr=!exStr!%%~ni,
		ECHO const %%~ni = require^('./%%~ni'^); >> toolkit.js
	)
)

SET exStr=%exStr:~0,-1%
SET exStr=!exStr!}
ECHO !exStr! >> toolkit.js;

CD ../../..
EXIT /B 0
