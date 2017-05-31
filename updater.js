const { concat } = require('redux-fp')

import { updater as agents } from './agents'
import { updater as accounts } from './accounts'
import { updater as authentication } from './authentication'

export default concat(
  agents,
  accounts,
  authentication
)
