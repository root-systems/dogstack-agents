const { pipe, prop, propOr } = require('ramda')
const { createSelector } = require('reselect')

const getCurrentCredentialId = require('../../authentication/getters/getCredentialId')
const getCredentials = require('../../credentials/getters/getCredentials')

module.exports = createSelector(
  getCurrentCredentialId,
  getCredentials,
  pipe(
    prop,
    propOr(null, 'agentId')
  )
)
