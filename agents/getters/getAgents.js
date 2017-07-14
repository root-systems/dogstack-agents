import { uncurryN, merge, map } from 'ramda'
import { createSelector } from 'reselect'

import getCredentialByAgent from '../../credentials/getters/getCredentialByAgent'
import getProfileByAgent from '../../profiles/getters/getProfileByAgent'
import getRawAgents from './getRawAgents'

export default createSelector(
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
