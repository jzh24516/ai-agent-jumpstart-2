targetScope = 'subscription'

@description('Short environment name used to create deterministic resource names.')
param environmentName string = 'survey'

@allowed([
  'westus3'
  'eastus2'
])
param location string = 'westus3'

@description('Browser origin allowed to call the public survey gateway.')
param allowedOrigin string = 'https://jzh24516.github.io'

@description('Canonical published workshop site URL.')
param sourceSiteUrl string = 'https://jzh24516.github.io/ai-agent-jumpstart-2/'

@description('Object ID of the deployment identity that initializes Key Vault secrets.')
param deployerObjectId string = deployer().objectId

var resourceToken = toLower(uniqueString(subscription().id, location, environmentName))
var resourceGroupName = 'azrg${resourceToken}'

resource resourceGroup 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: resourceGroupName
  location: location
  tags: {
    workload: 'agent-jumpstart-survey'
    environment: environmentName
  }
}

module resources 'resources.bicep' = {
  name: 'survey-resources-${resourceToken}'
  scope: resourceGroup
  params: {
    environmentName: environmentName
    location: location
    allowedOrigin: allowedOrigin
    sourceSiteUrl: sourceSiteUrl
    deployerObjectId: deployerObjectId
  }
}

output resourceGroupName string = resourceGroup.name
output functionAppName string = resources.outputs.functionAppName
output functionAppUrl string = resources.outputs.functionAppUrl
output keyVaultName string = resources.outputs.keyVaultName
output applicationInsightsName string = resources.outputs.applicationInsightsName