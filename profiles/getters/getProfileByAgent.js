import { createSelector } from 'reselect'
import { pipe, values, indexBy, prop } from 'ramda'

import getProfiles from './getProfiles'

export default createSelector(
  getProfiles,
  pipe(
    values,
    indexBy(prop('agentId'))
  )
)
