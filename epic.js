const { combineEpics } = require('redux-observable')

import { epic as agents } from './agents'
import { epic as accounts } from './accounts'
import { epic as authentication } from './authentication'

export default combineEpics(
  agents,
  accounts,
  authentication
)
