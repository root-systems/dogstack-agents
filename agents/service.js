const feathersKnex = require('feathers-knex')
const isNil = require('ramda/src/isNil')
const merge = require('ramda/src/merge')

module.exports = function () {
  const app = this
  const db = app.get('db')

  const name = 'agents'
  const options = { Model: db, name }

  app.use(name, feathersKnex(options))
  app.service(name).hooks(hooks)
}

const hooks = {
  before: {
    create: [
      getProfileData
    ]
  },
  after: {
    create: [
      createProfile
    ]
  },
  error: {}
}

function getProfileData (hook) {
  hook.params.profile = hook.data.profile
  delete hook.data.profile
  return hook
}

function createProfile (hook) {
  const profiles = hook.app.service('profiles')

  const agent = hook.result
  var { profile = {} } = hook.params

  profile = merge(profile, {
    agentId: agent.id
  })

  return profiles.create(profile)
  .then(() => hook)
}

