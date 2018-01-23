const feathersKnex = require('feathers-knex')
const { iff } = require('feathers-hooks-common')
const isNil = require('ramda/src/isNil')
const isEmpty = require('ramda/src/isEmpty')
const merge = require('ramda/src/merge')
const is = require('ramda/src/is')
const pipe = require('ramda/src/pipe')
const map = require('ramda/src/map')
const prop = require('ramda/src/prop')
const bind = require('ramda/src/bind')

const isArray = is(Array)
const getAgentIds = map(prop('agentId'))

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
      getData('profile'),
      getData('credential'),
      getData('relationships'),
      getData('contextAgentId'),
      agentAndCredentialAlreadyExist
    ],
    patch: [
      getData('profile'),
      getData('credential'),
      getData('relationships'),
      getData('contextAgentId')
    ]
  },
  after: {
    create: [
      createHasOneRelated('profile', 'profiles', 'agentId'),
      iff(isPersonAgent,
        iff(isNotCreatingCredential,
          createHasOneRelated('credential', 'credentials', 'agentId')
        )
      ),
      iff(isPersonAgent, createRelationships)
    ],
    patch: [
      patchHasOneRelated('profile', 'profiles', 'agentId'),
      iff(isPersonAgent, patchHasOneRelated('credential', 'credentials', 'agentId')),
      iff(isPersonAgent, patchRelationships)
    ],
    remove: [
      removeRelated('profiles', 'agentId'),
      removeRelated('credentials', 'agentId'),
      removeRelated('relationships', ['sourceId', 'targetId'])
    ]
  },
  error: {}
}

function agentAndCredentialAlreadyExist (hook) {
  // { query: {},
  //   provider: 'socketio',
  //   payload: { credentialId: 1 },
  //   credential: { email: 'greg4@rootsystems.nz' },
  //   accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJjcmVkZW50aWFsSWQiOjEsImlhdCI6MTUxNjY2Mjg4NSwiZXhwIjoxNTE2NzQ5Mjg1LCJhdWQiOiJodHRwczovL3lvdXJkb21haW4uY29tIiwiaXNzIjoiZmVhdGhlcnMiLCJzdWIiOiJhbm9ueW1vdXMiLCJqdGkiOiIyMWE3NzNjZi1jZjRhLTRmNDMtODFkNC03YjRlZTA0ZDMxNzIifQ.1UbSPxdZVfDbrgFolzIOmYN7giaPzJu0UrZ5GWwqhSU',
  //   headers: { Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJjcmVkZW50aWFsSWQiOjEsImlhdCI6MTUxNjY2Mjg4NSwiZXhwIjoxNTE2NzQ5Mjg1LCJhdWQiOiJodHRwczovL3lvdXJkb21haW4uY29tIiwiaXNzIjoiZmVhdGhlcnMiLCJzdWIiOiJhbm9ueW1vdXMiLCJqdGkiOiIyMWE3NzNjZi1jZjRhLTRmNDMtODFkNC03YjRlZTA0ZDMxNzIifQ.1UbSPxdZVfDbrgFolzIOmYN7giaPzJu0UrZ5GWwqhSU' },
  //   authenticated: true,
  //   agent: anonymous { id: 1, type: 'person' },
  //   profile: {},
  //   relationships: [ { relationshipType: 'member' } ],
  //   contextAgentId: 9 }
  const relationshipsService = hook.app.service('relationships')
  const credentialsService = hook.app.service('credentials')
  const agentsService = hook.app.service('agents')
  console.log(hook.params)
  const { contextAgentId, relationships, credential } = hook.params
  // 1. query for credential based on email

  return credentialsService.find({
    query: {
      email: credential.email
    }
  })
  .then((credentialResults) => {
    const agentIds = getAgentIds(credentialResults)
    console.log('credentialResults', credentialResults)
    console.log('agentIds', agentIds)
    console.log('credentialResults isEmpty', isEmpty(credentialResults))
    console.log('credentialResults isNil', isNil(credentialResults))
    return agentsService.find({
      query: {
        id: {
          $in: agentIds
        }
      }
    })
    .then((agentResults) => {
      console.log('agentResults', agentResults)
      if (isEmpty(agentResults)) {
        console.log('new agent, continuing as per')
        return hook
      } else {
        console.log('existing agent, skipping service method call')
        hook.result = agentResults[0]
        return hook
      }
    })
  })
  // 2. query for agent based on credential
  // 3. if both exist, create appropriate relationships based on relationships array
  // where sourceId: contextAgentId, and targetId is existing individual agent
  // 4. and return hook.result with agent object?
}

function isNotCreatingCredential (hook) {
  return !hook.params.isCreatingCredential
}

function getData (name) {
  return (hook) => {
    if (isNil(hook.data[name])) return hook
    hook.params[name] = hook.data[name]
    delete hook.data[name]
    return hook
  }
}

function createHasOneRelated (name, serviceName, foreignKey) {
  return (hook) => {
    const id = hook.result.id
    const service = hook.app.service(serviceName)
    var data = hook.params[name] || {}

    data = merge(data, { [foreignKey]: id })

    return service.create(data)
    .then(() => hook)
  }
}

function patchHasOneRelated (name, serviceName, foreignKey) {
  return (hook) => {
    const agentId = hook.result.id
    const data = hook.params[name] || {}
    const service = hook.app.service(serviceName)
    const foreignQuery = (foreignKey) => ({ [foreignKey]: agentId })
    var query = isArray(foreignKey)
      ? { $or: map(foreignQuery, foreignKeys) }
      : foreignQuery(foreignKey)
    query.$limit = 1
    query.$select = ['id']
    return service.find({ query })
    .then(([prevData]) => {
      return service.patch(prevData.id, data)
    })
    .then(() => hook)
  }
}

function createRelationships (hook) {
  const agent = hook.result
  const relationshipsService = hook.app.service('relationships')
  var { relationships = [], contextAgentId } = hook.params

  return Promise.all(relationships.map((relationship) => {
    const relationshipData = merge(relationship, {
      sourceId: contextAgentId,
      targetId: agent.id
    })
    return relationshipsService.create(relationshipData)
  }))
  .then(() => hook)
}

function patchRelationships (hook) {
  const agent = hook.result
  const relationshipsService = hook.app.service('relationships')
  var { relationships = [], contextAgentId } = hook.params

  return Promise.all(relationships.map((relationship) => {
    const relationshipData = merge(relationship, {
      sourceId: contextAgentId,
      targetId: agent.id
    })
    return relationshipsService.find({ query: relationshipData })
    .then((findResult) => {
      if (findResult.length === 0) {
        return relationshipsService.create(relationshipData)
      }

      const [prevRelationship] = findResult
      const { id: prevId } = prevRelationship
      return relationshipsService.patch(prevId, relationshipData)
    })
  }))
  .then(() => hook)
}

function isPersonAgent (hook) {
  console.log('isPersonAgent hook')
  return hook.result.type === 'person'
}

const removeAll = (service) => pipe(
  map(pipe(
    prop('id'),
    bind(service.remove, service)
  )),
  bind(Promise.all, Promise)
)

function removeRelated (serviceName, foreignKey) {
  return (hook) => {
    const agentId = hook.id
    const service = hook.app.service(serviceName)
    const foreignQuery = (foreignKey) => ({ [foreignKey]: agentId })
    var query = isArray(foreignKey)
      ? { $or: map(foreignQuery, foreignKey) }
      : foreignQuery(foreignKey)
    query.$select = ['id']
    return service.find({ query })
    .then(removeAll(service))
    .then(() => hook)
  }
}
