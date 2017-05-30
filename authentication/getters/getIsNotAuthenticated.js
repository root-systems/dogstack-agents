import { createSelector } from 'reselect'
import { not } from 'ramda'

import getAccount from './getAccount'

export default createSelector(
  getAccount,
  not
)
