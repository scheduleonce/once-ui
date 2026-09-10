# Migration install script - removes node_modules robustly and reinstalls
$ErrorActionPreference = 'Continue'
$log = 'C:\Users\rameshwar.verma_once\Desktop\repositories\once-ui\migration-install.log'

function Log($msg) {
  Add-Content -Path $log -Value ("[{0}] {1}" -f (Get-Date -Format 'HH:mm:ss'), $msg)
}

Set-Content -Path $log -Value "=== Migration install started $(Get-Date) ==="

# Restore PATH
$env:Path = [System.Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path','User')

# Remove node_modules with retries (Windows file locking)
$attempts = 0
while (Test-Path 'C:\Users\rameshwar.verma_once\Desktop\repositories\once-ui\node_modules') {
  $attempts++
  Log "Removing node_modules (attempt $attempts)..."
  Remove-Item 'C:\Users\rameshwar.verma_once\Desktop\repositories\once-ui\node_modules' -Recurse -Force -ErrorAction SilentlyContinue
  Start-Sleep -Seconds 2
  if ($attempts -ge 10) {
    Log "WARNING: node_modules could not be fully removed after $attempts attempts"
    break
  }
}

if (Test-Path 'C:\Users\rameshwar.verma_once\Desktop\repositories\once-ui\node_modules') {
  Log "node_modules still exists - using cmd rmdir as fallback"
  cmd /c "rmdir /s /q C:\Users\rameshwar.verma_once\Desktop\repositories\once-ui\node_modules" 2>&1 | Out-Null
}

Log "node_modules removed: $(-not (Test-Path 'C:\Users\rameshwar.verma_once\Desktop\repositories\once-ui\node_modules'))"

# Run npm install
Log "Starting npm install..."
Push-Location 'C:\Users\rameshwar.verma_once\Desktop\repositories\once-ui'
npm install 2>&1 | ForEach-Object { Log $_ }
$code = $LASTEXITCODE
Pop-Location
Log "npm install exit code: $code"
Log "=== Migration install finished $(Get-Date) ==="