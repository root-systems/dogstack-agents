const { uncurryN, merge, map, propOr } = require('ramda')
const { createSelector } = require('reselect')

const getCredentialByAgent = require('../../credentials/getters/getCredentialByAgent')
const getProfileByAgent = require('../../profiles/getters/getProfileByAgent')
const getRawAgents = require('./getRawAgents')
const getMembersByGroup = require('./getMembersByGroup')
const getGroupsByMember = require('./getGroupsByMember')

const propOrEmptyArray = propOr([])

module.exports = createSelector(
  getCredentialByAgent,
  getProfileByAgent,
  getMembersByGroup,
  getRawAgents,
  (credentialByAgent, profileByAgent, membersByGroup, groupsByMember, rawAgents) => {
    const mapAgentRelationships = map(agent => {
      const { agentId } = agent
      return merge(agent, {
        agent: merge(rawAgents[agentId], {
          id: agentId,
          credential: credentialByAgent[agentId],
          profile: profileByAgent[agentId]
        })
      })
    })

    const mapAgents = map(agent => {
      const members = propOrEmptyArray(agent.id, membersByGroup)
      const groups = propOrEmptyArray(agent.id, groupsByMember)
      return merge(agent, {
        credential: credentialByAgent[agent.id],
        profile: profileByAgent[agent.id],
        members: mapAgentRelationships(members),
        groups: mapAgentRelationships(groups)
      })
    })

    return mapAgents(rawAgents)
  }
)
