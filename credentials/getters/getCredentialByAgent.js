const { createSelector } = require('reselect')
const { pipe, values, indexBy, prop } = require('ramda')

const getCredentials = require('./getCredentials')

module.exports = createSelector(
  getCredentials,
  pipe(
    values,
    indexBy(prop('agentId'))
  )
)
