const merge = require('ramda/src/merge')
const isNil = require('ramda/src/isNil')
const path = require('ramda/src/path')

function addCurrentProfile(hook) {
  if (isNil(path(['params', 'credential', 'agentId'], hook))) return hook

  const profiles = hook.app.service('profiles')

  return profiles.find({ query: { agentId: hook.params.credential.agentId } })
    .then((profiles) => {
      hook.params = merge(hook.params, {
        profiles: profiles
      })
      return hook
    })
}

export default addCurrentProfile