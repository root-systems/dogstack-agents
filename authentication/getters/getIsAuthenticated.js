import { createSelector } from 'reselect'

import getCredential from './getCredential'

export default createSelector(
  getCredential,
  Boolean
)
