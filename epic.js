const { combineEpics } = require('redux-observable')

import { epic as agents } from './agents'
import { epic as credentials } from './credentials'
import { epic as authentication } from './authentication'

export default combineEpics(
  agents,
  credentials,
  authentication
)
