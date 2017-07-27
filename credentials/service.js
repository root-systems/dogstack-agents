const feathersKnex = require('feathers-knex')
const { hashPassword } = require('feathers-authentication-local').hooks
const { isProvider: isTransport, iff, discard } = require('feathers-hooks-common')

module.exports = function () {
  const app = this
  const db = app.get('db')

  const name = 'credentials'
  const options = { Model: db, name }

  app.use(name, feathersKnex(options))
  app.service(name).hooks(hooks)
}

const hooks = {
  before: {
    create: [
      hashPassword(),
      setProfileData,
      createAgent,
      getEmailFromRemote,
      clearRemoteData
    ]
  },
  after: {
    all: [
      iff(isTransport('external'), discard('password'))
    ]
  },
  error: {
    create: [
      deleteIfCreateFailed
    ]
  }
}

function getEmailFromRemote (hook) {
  if (hook.params.oauth) {
    const remoteProvider = hook.params.oauth.provider
    const remoteData = hook.data[remoteProvider]
    const remoteProfile = remoteData.profile
    if (remoteProfile.emails && remoteProfile.emails.length > 0) {
      hook.data.email = remoteProfile.emails[0].value
    }
  }
  return hook
}

function createAgent (hook) {
  const agents = hook.app.service('agents')

  if (!hook.data) return Promise.resolve(hook)

  const data = {
    profile: hook.data.profile
  }
  delete hook.data.profile

  return agents.create(data)
  .then(agent => {
    hook.data.agentId = agent.id
    return hook
  })
}

function clearRemoteData (hook) {
  if (hook.params.oauth) {
    const remoteProvider = hook.params.oauth.provider
    delete hook.data[remoteProvider]
  }
  return hook
}

function setProfileData (hook) {
  if (!hook.data) return hook

  var name, avatar

  if (hook.params.oauth) {
    const remoteProvider = hook.params.oauth.provider
    const remoteData = hook.data[remoteProvider]
    const remoteProfile = remoteData.profile
    name = remoteProfile.displayName
    if (remoteProfile.photos && remoteProfile.photos.length > 0) {
      avatar = remoteProfile.photos[0].value
    }
  }

  const { agentId } = hook.data
  
  hook.data.profile = {
    name,
    avatar
  }

  return hook
}

// TODO replace this with proper database transactions
// https://github.com/feathersjs/feathers-knex/issues/91
function deleteIfCreateFailed (hook) {
  const agents = hook.app.service('agents')
  const profiles = hook.app.service('profiles')

  const { agentId } = hook.data
  if (!agentId) return hook

  return Promise.all([
    agents.remove({ id: agentId }),
    profiles.find({ agentId })
      .then((profileList) => {
        return Promise.all(profileList.map(profile => {
          return profiles.remove({ id: profile.id })
        }))
      })
  ]).then(() => hook)
}
