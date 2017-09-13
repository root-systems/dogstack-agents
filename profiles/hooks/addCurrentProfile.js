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
module.exports = function addCurrentProfile (hook) {
  if (hasAgentId(hook)) return hook

  const profiles = hook.app.service('profiles')

  return profiles.find({
    query: {
      agentId: hook.params.credential.agentId,
      $limit: 1
    }
  })
  .then((profile) => {
    hook.params = merge(hook.params, {
      profile: profile
    })
    return hook
  })
}
