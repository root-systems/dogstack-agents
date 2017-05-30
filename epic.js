const { combineEpics } = require('redux-observable')

module.exports = combineEpics(
  require('./agents').epic,
  require('./accounts').epic,
  require('./authentication').epic
)
