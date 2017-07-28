const { createSelector } = require('reselect')
const { pipe, values, indexBy, prop } = require('ramda')

const getProfiles = require('./getProfiles')

module.exports = createSelector(
  getProfiles,
  pipe(
    values,
    indexBy(prop('agentId'))
  )
)
