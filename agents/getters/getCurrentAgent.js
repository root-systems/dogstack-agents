import { prop } from 'ramda'
import { createSelector } from 'reselect'

import getAgents from './getAgents'
import getCurrentAgentId from './getCurrentAgentId'

export default createSelector(
  getCurrentAgentId,
  getAgents,
  prop
)
