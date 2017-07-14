import { createSelector } from 'reselect'
import { complement } from 'ramda'

import getIsAuthenticated from './getIsAuthenticated'

export default complement(getIsAuthenticated)
