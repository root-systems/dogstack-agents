import { createSelector } from 'reselect'
import { not } from 'ramda'

import getCredential from './getCredential'

export default createSelector(
  getCredential,
  not
)
