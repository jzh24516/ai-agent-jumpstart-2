param(
    [string]$TenantId = "3a7de2c8-5926-441d-b82a-1f1989794caa",
    [string]$EnvironmentId = "d37505ad-37df-eccf-b172-39255da7a512",
    [string]$SolutionId = "4424145a-eeb0-f111-aaac-3833c5eaede1",
    [string]$FlowId = "0c4bd284-01fb-435a-8c2e-311764b61264"
)

$ErrorActionPreference = "Stop"

Import-Module Microsoft.PowerApps.Administration.PowerShell
Add-PowerAppsAccount -Endpoint prod -TenantID $TenantId | Out-Null

Add-AdminFlowsToSolution `
    -EnvironmentName $EnvironmentId `
    -SolutionId $SolutionId `
    -FlowNames @($FlowId)

Write-Host "Survey flow migrated to AgentJumpStartSurvey." -ForegroundColor Green