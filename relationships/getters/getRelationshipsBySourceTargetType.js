const { createSelector } = require('reselect')
const { values, pipe, map, groupBy, indexBy, prop } = require('ramda')

const getRelationships = require('./getRelationships')

const getRelationshipsBySourceTargetType = createSelector(
  getRelationships,
  pipe(
    values,
    groupBy(prop('sourceId')),
    map(pipe(
      groupBy(prop('targetId')),
      map(
        groupBy(prop('relationshipType'))
      )
    ))
  )
)

module.exports = getRelationshipsBySourceTargetType
