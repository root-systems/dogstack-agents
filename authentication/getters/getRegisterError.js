import { createSelector } from 'reselect'
import { propOr } from 'ramda'

import getAuthentication from './getAuthentication'

export default createSelector(
  getAuthentication,
  propOr(null, 'registerError')
)
