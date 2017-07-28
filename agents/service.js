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
      getRelationshipData,
      getContextAgentData
    ]
  },
  after: {
    create: [
      createProfile,
      iff(isPersonAgent, createCredential),
      iff(isPersonAgent, createRelationship)
    ]
  },
  error: {}
}

function getProfileData (hook) {
  hook.params.profile = hook.data.profile
  delete hook.data.profile
  return hook
}

function getCredentialData (hook) {
  hook.params.credential = hook.data.credential
  delete hook.data.credential
  return hook
}

function getRelationshipData (hook) {
  hook.params.relationship = hook.data.relationship
  delete hook.data.relationship
  return hook
}

function getContextAgentData (hook) {
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

function createRelationship (hook) {
  const agent = hook.result
  const relationships = hook.app.service('relationships')
  var { relationship = {}, contextAgent = {} } = hook.params

  relationship = merge(relationship, {
    source: contextAgent.id,
    target: agent.id
  })

  return relationships.create(relationship)
  .then(() => hook)
}

function isPersonAgent (hook) {
  return hook.result.type === 'person'
}
