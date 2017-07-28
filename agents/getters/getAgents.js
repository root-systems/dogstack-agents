const { uncurryN, merge, map } = require('ramda')
const { createSelector } = require('reselect')

const getCredentialByAgent = require('../../credentials/getters/getCredentialByAgent')
const getProfileByAgent = require('../../profiles/getters/getProfileByAgent')
const getRawAgents = require('./getRawAgents')

module.exports = createSelector(
  getCredentialByAgent,
  getProfileByAgent,
  getRawAgents,
  uncurryN(3, (credentialByAgent, profileByAgent) => map(agent => {
    return merge(agent, {
      credential: credentialByAgent[agent.id],
      profile: profileByAgent[agent.id]
    })
  }))
)
