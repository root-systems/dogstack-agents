import { pipe, prop, propOr } from 'ramda'
import { createSelector } from 'reselect'

import getCurrentCredentialId from '../../authentication/getters/getCredentialId'
import getCredentials from '../../credentials/getters/getCredentials'

export default createSelector(
  getCurrentCredentialId,
  getCredentials,
  pipe(
    prop,
    propOr(null, 'agentId')
  )
)
