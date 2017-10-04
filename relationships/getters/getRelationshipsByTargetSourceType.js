const { createSelector } = require('reselect')
const { values, pipe, map, groupBy, indexBy, prop } = require('ramda')

const getRelationships = require('./getRelationships')

const getRelationshipsByTargetSourceType = createSelector(
  getRelationships,
  pipe(
    values,
    groupBy(prop('targetId')),
    map(pipe(
      groupBy(prop('sourceId')),
      map(
        groupBy(prop('relationshipType'))
      )
    ))
  )
)

module.exports = getRelationshipsByTargetSourceType
