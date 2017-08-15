const { uncurryN, merge, map, propOr } = require('ramda')
const { createSelector } = require('reselect')

const getCredentialByAgent = require('../../credentials/getters/getCredentialByAgent')
const getProfileByAgent = require('../../profiles/getters/getProfileByAgent')
const getRawAgents = require('./getRawAgents')
const getMembersByGroup = require('./getMembersByGroup')

const propOrEmptyArray = propOr([])

module.exports = createSelector(
  getCredentialByAgent,
  getProfileByAgent,
  getMembersByGroup,
  getRawAgents,
  (credentialByAgent, profileByAgent, membersByGroup, rawAgents) => {
    const mapMembers = map(member => {
      const { agentId } = member
      return merge(member, {
        agent: merge(rawAgents[agentId], {
          id: agentId,
          credential: credentialByAgent[agentId],
          profile: profileByAgent[agentId]
        })
      })
    })

    const mapAgents = map(agent => {
      const members = propOrEmptyArray(agent.id, membersByGroup)
      return merge(agent, {
        credential: credentialByAgent[agent.id],
        profile: profileByAgent[agent.id],
        members: mapMembers(members)
      })
    })

    return mapAgents(rawAgents)
  }
)
