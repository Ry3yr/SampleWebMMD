@echo off
setlocal enabledelayedexpansion

:: Define source directories
set audioDir="E:\Dropbox\Public\00_Html\Examples\3D_Model_render\MMD\SampleWebMMD-master\audio"
set cameraDir="E:\Dropbox\Public\00_Html\Examples\3D_Model_render\MMD\SampleWebMMD-master\camera"
set vmdDir="E:\Dropbox\Public\00_Html\Examples\3D_Model_render\MMD\SampleWebMMD-master\vmd"

:: Define target directories on the desktop with hard-coded paths
set audioTarget="C:\Users\User\Desktop\NewElements\audio"
set cameraTarget="C:\Users\User\Desktop\NewElements\camera"
set vmdTarget="C:\Users\User\Desktop\NewElements\vmd"

:: Create target directories on the desktop
if not exist %audioTarget% mkdir %audioTarget%
if not exist %cameraTarget% mkdir %cameraTarget%
if not exist %vmdTarget% mkdir %vmdTarget%

:: Function to copy the 5 newest files
call :copyNewestFiles %audioDir% %audioTarget%
call :copyNewestFiles %cameraDir% %cameraTarget%
call :copyNewestFiles %vmdDir% %vmdTarget%

goto :eof

:copyNewestFiles
setlocal

set "sourceDir=%~1"
set "targetDir=%~2"

:: Change to the source directory
pushd %sourceDir%

:: Get the 6 newest files
for /f "delims=" %%f in ('dir /b /a-d /o-d') do (
    set /a count+=1
    if !count! leq 6 (
        echo Copying %%f to %targetDir%
        copy "%%f" "%targetDir%" >nul
    ) else (
        goto :done
    )
)

:done
:: Return to the original directory
popd
endlocal
goto :eof
