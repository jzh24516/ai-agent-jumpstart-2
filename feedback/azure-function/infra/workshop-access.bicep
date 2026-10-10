targetScope = 'resourceGroup'

param keyVaultName string

@secure()
param workshopAccessConfig string

resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' existing = {
  name: keyVaultName
}

resource accessConfigSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'workshop-access-config'
  properties: {
    value: workshopAccessConfig
  }
}
