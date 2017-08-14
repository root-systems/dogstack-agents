const { pipe, toPairs, map, reduce, keys, invertObj } = require('ramda')
const { createSelector } = require('reselect')

const getRelationshipsBySourceTargetType = require('../../relationships/getters/getRelationshipsBySourceTargetType')

module.exports = createSelector(
  getRelationshipsBySourceTargetType,
  pipe(
    map(pipe(
      toPairs,
      // TODO combine relationships into roles more intellingently
      // - check for member relationship, otherwise no roles
      // - handle duplicate relationships of same type (how?)
      reduce((sofar, [targetId, relationshipsByType]) => {
        const agentId = targetId
        const roles = map(() => true, relationshipsByType)
        const member = { agentId, roles }
        return [...sofar, member]
      }, [])
    ))
  )
)
