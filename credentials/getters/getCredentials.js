import { createSelector } from 'reselect'

import getRawCredentials from './getRawCredentials'

export default createSelector(
  getRawCredentials,
  (credentials) => credentials
)
