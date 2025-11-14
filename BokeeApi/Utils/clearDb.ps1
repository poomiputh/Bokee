# Rebuild-Db.ps1
param (
    [Parameter(Mandatory = $true)]
    [string]$RootPath
)

$apiProjectPath = Join-Path $RootPath "BokeeApi.csproj"
$migrationPath = Join-Path $RootPath "Migrations"

Write-Host $apiProjectPath

$timestamp = Get-Date -UFormat %s
$backupPath = "$env:TEMP\bokee_migrations_backup_$timestamp"
New-Item -ItemType Directory -Force -Path $backupPath | Out-Null
Move-Item $migrationPath $backupPath -ErrorAction SilentlyContinue

try {
    dotnet ef database drop --project $apiProjectPath
    dotnet ef migrations add init --project $apiProjectPath
    dotnet ef database update --project $apiProjectPath 
}
catch {
    Write-Host "Something failed, restoring Migrations folder..."
    Move-Item "$backupPath\Migrations" $migrationPath -ErrorAction SilentlyContinue
}

Remove-Item -Recurse -Force $backupPath
