@echo off
SETLOCAL EnableExtensions EnableDelayedExpansion

:: Variables
SET "sourceRepo=C:\Users\P52\Documents\Coding\minesweeper"
SET "destRepo=C:\Users\P52\Documents\Coding\burseylj.github.io"
SET "buildOutput=dist/minesweeper"  :: Change 'minesweeper' to the actual output directory name

:: Navigate to the source repository and build the Angular app
cd /d "%sourceRepo%"
IF %ERRORLEVEL% NEQ 0 (
    echo Failed to navigate to minesweeper directory.
    exit /b %ERRORLEVEL%
)

echo Building the Angular app...
ng build --configuration production --base-href "https://burseylj.github.io/"

IF %ERRORLEVEL% NEQ 0 (
    echo Build failed.
    exit /b %ERRORLEVEL%
)

:: Navigate to the destination repository
cd /d "%destRepo%"
IF %ERRORLEVEL% NEQ 0 (
    echo Failed to navigate to GitHub Pages directory.
    exit /b %ERRORLEVEL%
)

echo Removing old build...

:: Remove all files and directories except the .git directory and other dotfiles/folders
FOR /D %%p IN (*) DO rmdir "%%p" /s /q
del /q /a:H *.*  :: Remove hidden files if needed
FOR /F "delims=" %%i IN ('dir /b /a-d-h-s-l *.*') DO del /f /q "%%i"

:: Copy the new build to the GitHub Pages repo
echo Copying new build to GitHub Pages repository...
xcopy /E /I /Y "%sourceRepo%\%buildOutput%\*" .

:: Add all changes to git and push
echo Committing and pushing to GitHub...
git add .
git commit -m "Update site"
git push origin master

IF %ERRORLEVEL% NEQ 0 (
    echo Failed to push to GitHub.
    exit /b %ERRORLEVEL%
)

echo Deployment successful!
ENDLOCAL
