const { createSelector } = require('reselect')

const getCredentialId = require('./getCredentialId')

module.exports = createSelector(
  getCredentialId,
  Boolean
)
