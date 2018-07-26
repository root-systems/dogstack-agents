const test = require('ava')
const feathers = require('@feathersjs/feathers')
const Knex = require('knex')

const agentsService = require('./service')
const relationshipsService = require('../relationships/service')

const testConfig = {
  client: 'sqlite3',
  connection: {
    filename: ':memory:'
  },
  useNullAsDefault: true
}
const db = Knex(testConfig)
const migrationsConfig = { directory: 'db/migrations' }

test.before(t => {
  return db.migrate.rollback(migrationsConfig)
  .then(() => {
    return db.migrate.latest(migrationsConfig)
  })
})

test.beforeEach(t => {
  t.context.app = feathers()
  t.context.app.set('db', db)
  t.context.app.set('authentication', { secret: 'test' })
  t.context.app.configure(agentsService)
  t.context.app.configure(relationshipsService)
})

test('agents service is registered', t => {
  const agentsService = t.context.app.service('agents')

  t.truthy(agentsService, 'Registered the service')
})

test.serial('create an agent', t => {
  const agentsService = t.context.app.service('agents')
  return agentsService.create({
    password: 'testing123',
    email: 'testerson@test.com'
  })
  .then((agent) => {
    const { id, type, email } = agent
    const expected = {
      id: 1,
      type: 'person',
      email: 'testerson@test.com'
    }
    t.deepEqual({ id, type, email }, expected)
  })
})

test.serial('create an agent, no password in return', t => {
  const agentsService = t.context.app.service('agents')
  // Setting `provider` indicates an external request
  const params = { provider: 'rest' }
  return agentsService.create({
    password: 'testing123',
    email: 'testerson2@test.com'
  }, params)
  .then((agent) => {
    t.falsy(agent.password)
  })
})

test.serial('remove an agent with relationship, relationship is removed', t => {
  const agentsService = t.context.app.service('agents')
  const relationshipsService = t.context.app.service('relationships')
  // Setting `provider` indicates an external request
  const params = { provider: 'rest' }
  var agentId, relationshipId
  return agentsService.create([
    {
      password: 'testing123',
      email: 'testerson3@test.com'
    },
    {
      password: 'testing123',
      email: 'testerson4@test.com'
    }
  ], params)
  .then((agents) => {
    agentId = agents[0].id
    return relationshipsService.create({
      sourceId: agents[0].id,
      targetId: agents[1].id
    }, params)
  })
  .then((relationship) => {
    relationshipId = relationship.id
    return agentsService.remove(agentId, params)
  })
  .then(async (removedAgent) => {
    t.is(removedAgent.id, agentId)
    await t.throws(relationshipsService.get(relationshipId, params))
  })
})
