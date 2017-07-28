const { combineEpics } = require('redux-observable')

import { epic as agents } from './agents'
import { epic as credentials } from './credentials'
import { epic as profiles } from './profiles'
import { epic as authentication } from './authentication'
import { epic as relationships } from './relationships'

export default combineEpics(
  agents,
  credentials,
  profiles,
  authentication,
  relationships
)
