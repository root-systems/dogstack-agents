const { pipe, toPairs, map, filter, reduce  } = require('ramda')
const { createSelector } = require('reselect')

const getRolesBySourceTarget = require('../../relationships/getters/getRolesBySourceTarget')

module.exports = createSelector(
  getRolesBySourceTarget,
  map(pipe(
    toPairs,
    filter(([targetId, roles]) => roles.member),
    reduce((sofar, [targetId, roles]) =>  {
      const agentId = targetId
      const member = { agentId, roles }
      return [...sofar, member]
    }, [])
  ))
)
