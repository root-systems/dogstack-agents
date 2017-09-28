const { pipe, toPairs, map, filter, reduce  } = require('ramda')
const { createSelector } = require('reselect')

const getRolesByTargetSource = require('../../relationships/getters/getRolesByTargetSource')

module.exports = createSelector(
  getRolesByTargetSource,
  map(pipe(
    toPairs,
    filter(([targetId, roles]) => roles.member),
    reduce((sofar, [targetId, roles]) =>  {
      const agentId = parseInt(targetId)
      const group = { agentId, roles }
      return [...sofar, group]
    }, [])
  ))
)
