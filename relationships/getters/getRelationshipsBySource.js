const { createSelector } = require('reselect')
const { values, pipe, groupBy, prop } = require('ramda')

const getRelationships = require('./getRelationships')

const getRelationshipsBySource = createSelector(
  getRelationships,
  pipe(
    values,
    groupBy(prop('sourceId'))
  )
)

modules.export = getRelationshipsBySource
