import { createSelector, createStructuredSelector } from 'reselect'

import getAccount from './getAccount'

export default createSelector(
  getAccount,
  Boolean
)
