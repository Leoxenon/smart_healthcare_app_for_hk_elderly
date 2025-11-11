@echo off
echo 正在构建项目...
call npm run build

echo.
echo 构建完成！
echo.
echo 選擇部署方式：
echo 1. Vercel (推荐) - 需要先运行: vercel login
echo 2. 手动上传到Netlify
echo 3. GitHub Pages (需要先推送到GitHub)
echo.
set /p choice="請選擇 (1-3): "

if "%choice%"=="1" (
    echo 正在使用Vercel部署...
    vercel --prod
    echo 部署完成！查看部署URL。
) else if "%choice%"=="2" (
    echo 請打開 netlify.com，並將 'dist' 文件夾拖拽到Deploy頁面
    explorer dist
) else if "%choice%"=="3" (
    echo 請確保代碼已推送到GitHub，然後運行: npm run deploy
) else (
    echo 無效選擇
)

pause
