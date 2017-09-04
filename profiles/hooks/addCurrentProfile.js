const merge = require('ramda/src/merge')
const isNil = require('ramda/src/isNil')

function addCurrentProfile(hook) {
  if (isNil(hook.params.credential.agentId)) return hook

  const profiles = hook.app.service('profiles')

  return profiles.find({ query: { agentId: hook.params.credential.agentId } })
    .then((profiles) => {
      return merge(hook, {
        params: merge(hook.params, {
          profiles: profiles
        })
      })
    })
}

export default addCurrentProfile