import { createSelector } from 'reselect'
import { pipe, values, indexBy, prop } from 'ramda'

import getCredentials from './getCredentials'

export default createSelector(
  getCredentials,
  pipe(
    values,
    indexBy(prop('agentId'))
  )
)
