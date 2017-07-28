const { createSelector } = require('reselect')
const { propOr } = require('ramda')

const getAuthentication = require('./getAuthentication')

module.exports = createSelector(
  getAuthentication,
  propOr(null, 'credentialId')
)
