const { prop } = require('ramda')
const { createSelector } = require('reselect')

const getAgents = require('./getAgents')
const getCurrentAgentId = require('./getCurrentAgentId')

module.exports = createSelector(
  getCurrentAgentId,
  getAgents,
  prop
)
