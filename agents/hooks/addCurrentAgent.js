const merge = require('ramda/src/merge')
const isNil = require('ramda/src/isNil')
const path = require('ramda/src/path')

function addCurrentAgent(hook) {
  if (isNil(path(['params', 'credential', 'agentId'], hook))) return hook

  const agents = hook.app.service('agents')

  return agents.get(hook.params.credential.agentId)
    .then((agent) => {
      return merge(hook, {
        params: merge(hook.params, {
          agent: agent
        })
      })
    })
}

export default addCurrentAgent