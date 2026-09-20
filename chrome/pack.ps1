# Packs the chrome/ folder into a zip ready for upload to the Chrome Web
# Store Developer Dashboard (Package > Upload new package).
#
# Usage (from anywhere): powershell -File chrome/pack.ps1
#
# The Chrome Web Store wants the manifest.json at the ZIP's root, not
# inside a "chrome" folder - so this zips the *contents* of chrome/,
# not the chrome/ folder itself. Dev-only files (pack.ps1, CHANGELOG)
# are left out since they add nothing for end users.

$ErrorActionPreference = 'Stop'

$chromeDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$manifest = Get-Content (Join-Path $chromeDir 'manifest.json') -Raw | ConvertFrom-Json
$version = $manifest.version

$repoRoot = Split-Path -Parent $chromeDir
$distDir = Join-Path $repoRoot 'dist'
if (-not (Test-Path $distDir)) {
    New-Item -ItemType Directory -Path $distDir | Out-Null
}

$zipPath = Join-Path $distDir "tabcloud-plus-$version.zip"
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

$exclude = @('pack.ps1', 'CHANGELOG')
$items = Get-ChildItem -Path $chromeDir | Where-Object { $exclude -notcontains $_.Name }

$stagingDir = Join-Path $distDir "staging-$version"
if (Test-Path $stagingDir) {
    Remove-Item $stagingDir -Recurse -Force
}
New-Item -ItemType Directory -Path $stagingDir | Out-Null
foreach ($item in $items) {
    Copy-Item -Path $item.FullName -Destination $stagingDir -Recurse
}

Compress-Archive -Path (Join-Path $stagingDir '*') -DestinationPath $zipPath
Remove-Item $stagingDir -Recurse -Force

Write-Host "Packed version $version -> $zipPath"
