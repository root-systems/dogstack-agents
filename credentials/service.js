const feathersKnex = require('feathers-knex')
const { hashPassword } = require('feathers-authentication-local').hooks
const { isProvider: isTransport, iff, discard } = require('feathers-hooks-common')
const omit = require('ramda/src/omit')

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
      createAgent,
      createProfile,
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
      console.log('remoteProvider', hook.params.oauth, hook.data)
    const remoteData = hook.data[remoteProvider]
    if (remoteData.emails && remoteData.emails.length > 0) {
      hook.data.email = remoteData.emails[0]
    }
  }
  return hook
}


function createAgent (hook) {
  const agents = hook.app.service('agents')

  if (!hook.data) return Promise.resolve(hook)

  return agents.create({})
  .then(agent => {
    hook.data.agentId = agent.id
    return hook
  })
}


function createProfile (hook) {
  const profiles = hook.app.service('profiles')

  if (!hook.data) return Promise.resolve(hook)

  var name, avatar

  if (hook.params.oauth) {
    const remoteProvider = hook.params.oauth.provider
    const remoteData = hook.data[remoteProvider]

    name = remoteData.profile.displayName
    if (remoteData.photos && remoteData.photos.length > 0) {
      avatar = remoteData.photos[0].value
    }
  }

  const { agentId } = hook.data

  return profiles.create({
    agentId,
    name,
    avatar
  })
  .then(profile => {
    return hook
  })
}

function clearRemoteData (hook) {
  if (hook.params.oauth) {
    const remoteProvider = hook.params.oauth.provider
    //const omitRemoteData = omit([remoteProvider])
    //hook.data = omitRemoteData(hook.data)
    delete hook.data[remoteProvider]
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
