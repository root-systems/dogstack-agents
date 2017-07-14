const { concat } = require('redux-fp')

import { updater as agents } from './agents'
import { updater as credentials } from './credentials'
import { updater as profiles } from './profiles'
import { updater as authentication } from './authentication'

export default concat(
  agents,
  credentials,
  profiles,
  authentication
)
