$env:NODE_ENV = "development"
$process = Start-Process -NoNewWindow -PassThru -FilePath "node" -ArgumentList "dist/main.js"
$process.Id | Out-File -FilePath "server-pid.txt"
# Wait for it to start listening
Start-Sleep -Seconds 5
