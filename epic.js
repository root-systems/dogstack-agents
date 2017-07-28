const { combineEpics } = require('redux-observable')

const agents = require('./agents').epic
const credentials = require('./credentials').epic
const profiles = require('./profiles').epic
const authentication = require('./authentication').epic
const relationships = require('./relationships').epic

module.exports = combineEpics(
  agents,
  credentials,
  profiles,
  authentication,
  relationships
)
