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
      createAgent
    ]
  },
  after: {
    all: [
      iff(isTransport('external'), discard('password'))
    ]
  },
  error: {
    create: [
      deleteAgentIfCreateFailed
    ]
  }
}


function createAgent (hook) {
  const agents = hook.app.service('agents')
  const account = hook.data

  if (!account) return Promise.resolve(hook)

  return agents.create({})
    .then(agent => {
      hook.data.agentId = agent.id
      return Promise.resolve(hook)
    })
}

// TODO replace this with proper database transactions
// https://github.com/feathersjs/feathers-knex/issues/91
function deleteAgentIfCreateFailed (hook) {
  const agents = hook.app.service('agents')
  const agentToDelete = hook.data.agentId
  return agents.remove({id: agentToDelete})
    .then(() => Promise.resolve(hook))
}
