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
      iff(isCreatingCredentialAndProfile, createHasOneRelated('profile', 'profiles', 'agentId')),
      iff(isCreatingCredentialAndProfile,
        iff(isPersonAgent,
          iff(isNotCreatingCredential,
            createHasOneRelated('credential', 'credentials', 'agentId')
          )
        ),
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
  if (hook.data.type === 'group') return hook
  const credentialsService = hook.app.service('credentials')
  const agentsService = hook.app.service('agents')
  const { contextAgentId, relationships, credential } = hook.params

  if (isNil(credential)) return hook

  return credentialsService.find({
    query: {
      email: credential.email
    }
  })
  .then((credentialResults) => {
    const agentIds = getAgentIds(credentialResults)
    return agentsService.find({
      query: {
        id: {
          $in: agentIds
        }
      }
    })
    .then((agentResults) => {
      if (isEmpty(agentResults)) {
        return hook
      } else {
        hook.result = agentResults[0]
        hook.params.isSkippingCredentialAndProfileCreation = true
        return hook
      }
    })
  })
}

function isCreatingCredentialAndProfile (hook) {
  return !hook.params.isSkippingCredentialAndProfileCreation
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
