import { createSelector } from 'reselect'
import { propOr } from 'ramda'

import getCredential from './getCredential'

export default createSelector(
  getCredential,
  propOr(null, 'accessToken')
)
