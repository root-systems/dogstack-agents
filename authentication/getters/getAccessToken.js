import { createSelector } from 'reselect'
import { propOr } from 'ramda'

import getAccount from './getAccount'

export default createSelector(
  getAccount,
  propOr(null, 'accessToken')
)
