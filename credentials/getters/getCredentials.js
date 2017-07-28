const { createSelector } = require('reselect')

const getRawCredentials = require('./getRawCredentials')

module.exports = createSelector(
  getRawCredentials,
  (credentials) => credentials
)
