import { createSelector } from 'reselect'

import getRawProfiles from './getRawProfiles'

export default createSelector(
  getRawProfiles,
  (profiles) => profiles
)
