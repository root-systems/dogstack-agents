const feathersKnex = require('feathers-knex')
const { iff } = require('feathers-hooks-common')
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
      getProfileData,
      getCredentialData,
      getRelationshipsData,
      getContextAgentData
    ]
  },
  after: {
    create: [
      createProfile,
      iff(isPersonAgent, createCredential),
      iff(isPersonAgent, createRelationships)
    ]
  },
  error: {}
}

function getProfileData (hook) {
  if (isNil(hook.data.profile)) return hook
  hook.params.profile = hook.data.profile
  delete hook.data.profile
  return hook
}

function getCredentialData (hook) {
  if (isNil(hook.data.credential)) return hook
  hook.params.credential = hook.data.credential
  delete hook.data.credential
  return hook
}

function getRelationshipsData (hook) {
  if (isNil(hook.data.relationships)) return hook
  hook.params.relationships = hook.data.relationships
  delete hook.data.relationships
  return hook
}

function getContextAgentData (hook) {
  if (isNil(hook.data.contextAgent)) return hook
  hook.params.contextAgent = hook.data.contextAgent
  delete hook.data.contextAgent
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

function createCredential (hook) {
  const agent = hook.result
  const credentials = hook.app.service('credentials')
  var { credential = {} } = hook.params

  credential = merge(credential, {
    agentId: agent.id
  })

  return credentials.create(credential)
  .then(() => hook)
}

function createRelationships (hook) {
  const agent = hook.result
  const relationshipsService = hook.app.service('relationships')
  var { relationships = [], contextAgent = {} } = hook.params

  return Promise.all(relationships.map((relationship) => {
    const relationshipData = merge(relationship, {
      sourceId: contextAgent.id,
      targetId: agent.id
    })
    return relationshipsService.create(relationshipData)
  }))
  .then(() => hook)
}

function isPersonAgent (hook) {
  return hook.result.type === 'person'
}
