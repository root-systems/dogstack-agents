const { createSelector } = require('reselect')
const { map } = require('ramda')

const getRelationshipsBySourceTargetType = require('./getRelationshipsBySourceTargetType')

// TODO combine relationships into roles more intellingently
// - handle duplicate relationships of same type (how?)

const getRolesBySourceTarget = createSelector(
  getRelationshipsBySourceTargetType,
  map( // map into source
    map( // map into target
      map(() => true) // map into relationshipType
    )
  )
)

module.exports = getRolesBySourceTarget
