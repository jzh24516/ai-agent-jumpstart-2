targetScope = 'resourceGroup'

param keyVaultName string

@secure()
param flowCallbackUrl string

@secure()
param workshopSigningSecret string

@secure()
param workshopAccessConfig string

resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' existing = {
  name: keyVaultName
}

resource flowUrlSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'survey-flow-url'
  properties: {
    value: flowCallbackUrl
  }
}

resource signingSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'survey-workshop-signing-secret'
  properties: {
    value: workshopSigningSecret
  }

  resource accessConfigSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
    parent: keyVault
    name: 'workshop-access-config'
    properties: {
      value: workshopAccessConfig
    }
  }
}