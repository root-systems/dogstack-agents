const { uncurryN, merge, map } = require('ramda')
const { createSelector } = require('reselect')

const getCredentialByAgent = require('../../credentials/getters/getCredentialByAgent')
const getProfileByAgent = require('../../profiles/getters/getProfileByAgent')
const getRawAgents = require('./getRawAgents')
const getRelationshipsBySource = require('../../relationships/getters/getRelationshipsBySource')

module.exports = createSelector(
  getCredentialByAgent,
  getProfileByAgent,
  getRelationshipsBySource,
  getRawAgents,
  uncurryN(4, (credentialByAgent, profileByAgent, relationshipsBySource) => map(agent => {
    return merge(agent, {
      credential: credentialByAgent[agent.id],
      profile: profileByAgent[agent.id],
      sourceRelationships: relationshipsBySource[agent.id]
    })
  }))
)
