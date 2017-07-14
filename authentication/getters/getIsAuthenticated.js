import { createSelector } from 'reselect'

import getCredentialId from './getCredentialId'

export default createSelector(
  getCredentialId,
  Boolean
)
