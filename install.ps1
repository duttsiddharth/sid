# Run from the site root (C:\Users\Siddharth Dutt\Documents\GitHub\sid):  powershell -ExecutionPolicy Bypass -File .\install.ps1
# Copies ticker-banners.js next to your pages and adds one <script> tag before </body> in every .html file. Safe to re-run.
$root = Get-Location
$tag  = '<script src="/ticker-banners.js" defer></script>'
if (-not (Test-Path (Join-Path $root 'ticker-banners.js'))) { Write-Error 'ticker-banners.js must be in the site root.'; exit 1 }
Get-ChildItem -Path $root -Filter *.html -Recurse | Where-Object { $_.FullName -notmatch '\\(node_modules|\.git)\\' } | ForEach-Object {
  $raw = [System.IO.File]::ReadAllText($_.FullName)
  if ($raw -match 'ticker-banners\.js') { Write-Host "skip    $($_.Name)"; return }
  if ($raw -notmatch '(?i)</body>')     { Write-Host "no body $($_.Name)"; return }
  $new = [regex]::Replace($raw, '(?i)</body>', "  $tag`r`n</body>", 1)
  [System.IO.File]::WriteAllText($_.FullName, $new, (New-Object System.Text.UTF8Encoding($false)))
  Write-Host "added   $($_.Name)"
}
Write-Host "Done. Review with 'git diff', then git add/commit/push."
