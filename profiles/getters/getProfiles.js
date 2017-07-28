const { createSelector } = require('reselect')

const getRawProfiles = require('./getRawProfiles')

module.exports = createSelector(
  getRawProfiles,
  (profiles) => profiles
)
