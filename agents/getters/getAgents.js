const { uncurryN, merge, map, propOr } = require('ramda')
const { createSelector } = require('reselect')

const getCredentialByAgent = require('../../credentials/getters/getCredentialByAgent')
const getProfileByAgent = require('../../profiles/getters/getProfileByAgent')
const getRawAgents = require('./getRawAgents')
const getRelationshipsBySource = require('../../relationships/getters/getRelationshipsBySource')

const propOrEmptyArray = propOr([])

module.exports = createSelector(
  getCredentialByAgent,
  getProfileByAgent,
  getRelationshipsBySource,
  getRawAgents,
  (credentialByAgent, profileByAgent, relationshipsBySource, rawAgents) => {
    const mapRelationships = map(relationship => {
      const { sourceId, targetId } = relationship
      return merge(relationship, {
        source: merge(rawAgents[sourceId], {
          credential: credentialByAgent[sourceId],
          profile: profileByAgent[sourceId]
        }),
        target: merge(rawAgents[targetId], {
          credential: credentialByAgent[targetId],
          profile: profileByAgent[targetId]
        })
      })
    })

    const mapAgents = map(agent => {
      const sourceRelationships = propOrEmptyArray(agent.id, relationshipsBySource)
      return merge(agent, {
        credential: credentialByAgent[agent.id],
        profile: profileByAgent[agent.id],
        sourceRelationships: mapRelationships(sourceRelationships)
      })
    })

    return mapAgents(rawAgents)
  }
)
