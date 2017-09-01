const merge = require('ramda/src/merge')
const isNil = require('ramda/src/isNil')

function addCurrentAgent(hook) {
  if (isNil(hook.params.credential.agentId)) return hook

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