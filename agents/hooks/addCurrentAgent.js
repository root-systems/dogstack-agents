const merge = require('ramda/src/merge')
const isNil = require('ramda/src/isNil')
const path = require('ramda/src/path')
const pipe = require('ramda/src/pipe')
const not = require('ramda/src/not')
const hasAgentId = pipe(
  path(['params', 'credential', 'agentId']),
  isNil,
  not
)

module.exports = function addCurrentAgent (hook) {
  if (!hasAgentId(hook)) return hook

  const agents = hook.app.service('agents')

  return agents.get(hook.params.credential.agentId)
    .then((agent) => {
      hook.params = merge(hook.params, {
        agent: agent
      })
      return hook
    })
}
