const { concat } = require('redux-fp')

module.exports = concat(
  require('./agents').updater,
  require('./accounts').updater,
  require('./authentication').updater
)
