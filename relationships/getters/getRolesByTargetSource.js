const { createSelector } = require('reselect')
const { map } = require('ramda')

const getRelationshipsByTargetSourceType = require('./getRelationshipsByTargetSourceType')

// TODO combine relationships into roles more intellingently
// - handle duplicate relationships of same type (how?)

const getRolesByTargetSource = createSelector(
  getRelationshipsByTargetSourceType,
  map( // map into target
    map( // map into source
      map(() => true) // map into relationshipType
    )
  )
)

module.exports = getRolesByTargetSource
