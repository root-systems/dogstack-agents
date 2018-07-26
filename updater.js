const { concat } = require('redux-fp')

const agents = require('./agents').updater
// const credentials = require('./credentials').updater
// const profiles = require('./profiles').updater
const authentication = require('./authentication').updater
const relationships = require('./relationships').updater

module.exports = concat(
  agents,
  // credentials,
  // profiles,
  authentication,
  relationships
)
