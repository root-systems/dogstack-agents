const feathersKnex = require('feathers-knex')
const { hashPassword, protect } = require('@feathersjs/authentication-local').hooks
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
      hashPassword(),
      // iff(hasNoAgent, setProfileData),
      // iff(hasNoAgent, createAgent),
      getEmailFromRemote,
      clearRemoteData,
      getData('profile'),
      getData('credential'),
      getData('relationships'),
      getData('contextAgentId')
      // agentAndCredentialAlreadyExist
    ],
    update: [
      hashPassword(),
    ],
    patch: [
      hashPassword(),
      getData('profile'),
      getData('credential'),
      getData('relationships'),
      getData('contextAgentId')
    ]
  },
  after: {
    all: [
      protect('password')
    ],
    create: [
      // iff(isCreatingCredentialAndProfile, createHasOneRelated('profile', 'profiles', 'agentId')),
      // iff(isCreatingCredentialAndProfile,
      //   iff(isPersonAgent,
      //     iff(isNotCreatingCredential,
      //       createHasOneRelated('credential', 'credentials', 'agentId')
      //     )
      //   )
      // ),
      // iff(isPersonAgent, createRelationships) // IK: not sure why this should be a hook... why not just create relationships manually in app-land? why only person agents?
    ],
    patch: [
      // patchHasOneRelated('profile', 'profiles', 'agentId'),
      // iff(isPersonAgent, patchHasOneRelated('credential', 'credentials', 'agentId')),
      // iff(isPersonAgent, patchRelationships)
    ],
    remove: [
      // removeRelated('profiles', 'agentId'),
      // removeRelated('credentials', 'agentId'),
      removeRelated('relationships', ['sourceId', 'targetId'])
    ]
  },
  error: {}
}

// function agentAndCredentialAlreadyExist (hook) {
//   if (hook.data.type === 'group') return hook
//   const credentialsService = hook.app.service('credentials')
//   const agentsService = hook.app.service('agents')
//   const { contextAgentId, relationships, credential } = hook.params
//
//   if (isNil(credential)) return hook
//
//   return credentialsService.find({
//     query: {
//       email: credential.email
//     }
//   })
//   .then((credentialResults) => {
//     const agentIds = getAgentIds(credentialResults)
//     return agentsService.find({
//       query: {
//         id: {
//           $in: agentIds
//         }
//       }
//     })
//     .then((agentResults) => {
//       if (isEmpty(agentResults)) {
//         return hook
//       } else {
//         hook.result = agentResults[0]
//         hook.params.isSkippingCredentialAndProfileCreation = true
//         return hook
//       }
//     })
//   })
// }

// function isCreatingCredentialAndProfile (hook) {
//   return !hook.params.isSkippingCredentialAndProfileCreation
// }

// function isNotCreatingCredential (hook) {
//   return !hook.params.isCreatingCredential
// }

function getData (name) {
  return (hook) => {
    if (isNil(hook.data[name])) return hook
    hook.params[name] = hook.data[name]
    delete hook.data[name]
    return hook
  }
}

// function createHasOneRelated (name, serviceName, foreignKey) {
//   return (hook) => {
//     const id = hook.result.id
//     const service = hook.app.service(serviceName)
//     var data = hook.params[name] || {}
//
//     data = merge(data, { [foreignKey]: id })
//
//     return service.create(data)
//     .then(() => hook)
//   }
// }

// function patchHasOneRelated (name, serviceName, foreignKey) {
//   return (hook) => {
//     const agentId = hook.result.id
//     const data = hook.params[name] || {}
//     const service = hook.app.service(serviceName)
//     const foreignQuery = (foreignKey) => ({ [foreignKey]: agentId })
//     var query = isArray(foreignKey)
//       ? { $or: map(foreignQuery, foreignKeys) }
//       : foreignQuery(foreignKey)
//     query.$limit = 1
//     query.$select = ['id']
//     return service.find({ query })
//     .then(([prevData]) => {
//       return service.patch(prevData.id, data)
//     })
//     .then(() => hook)
//   }
// }

// function createRelationships (hook) {
//   const agent = hook.result
//   const relationshipsService = hook.app.service('relationships')
//   var { relationships = [], contextAgentId } = hook.params
//
//   return Promise.all(relationships.map((relationship) => {
//     const relationshipData = merge(relationship, {
//       sourceId: contextAgentId,
//       targetId: agent.id
//     })
//     return relationshipsService.create(relationshipData)
//   }))
//   .then(() => hook)
// }

// function patchRelationships (hook) {
//   const agent = hook.result
//   const relationshipsService = hook.app.service('relationships')
//   var { relationships = [], contextAgentId } = hook.params
//
//   return Promise.all(relationships.map((relationship) => {
//     const relationshipData = merge(relationship, {
//       sourceId: contextAgentId,
//       targetId: agent.id
//     })
//     return relationshipsService.find({ query: relationshipData })
//     .then((findResult) => {
//       if (findResult.length === 0) {
//         return relationshipsService.create(relationshipData)
//       }
//
//       const [prevRelationship] = findResult
//       const { id: prevId } = prevRelationship
//       return relationshipsService.patch(prevId, relationshipData)
//     })
//   }))
//   .then(() => hook)
// }

// function isPersonAgent (hook) {
//   return hook.result.type === 'person'
// }

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

// credentials hooks

// function hasNoAgent (hook) {
//   return isNil(hook.data.agentId)
// }

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

// function createAgent (hook) {
//   const agents = hook.app.service('agents')
//
//   if (!hook.data) return Promise.resolve(hook)
//
//   const data = {
//     profile: hook.data.profile
//   }
//   delete hook.data.profile
//
//   return agents.create(data, {
//     // HACK for https://github.com/root-systems/cobuy/issues/253
//     // see corresponding code in agents service
//     isCreatingCredential: true
//   })
//   .then(agent => {
//     hook.data.agentId = agent.id
//     return hook
//   })
// }

function clearRemoteData (hook) {
  if (hook.params.oauth) {
    const remoteProvider = hook.params.oauth.provider
    delete hook.data[remoteProvider]
  }
  return hook
}

// function setProfileData (hook) {
//   // TODO: IK: fairly certain I added the email field in here for simpler population of Cobuy profiles which have emails, if so that was a mistake as profile migration of this repo has no email field
//   if (!hook.data) return hook
//
//   var name = hook.data.name
//   // var email = hook.data.email
//   var avatar
//   delete hook.data.name
//
//   if (hook.params.oauth) {
//     const remoteProvider = hook.params.oauth.provider
//     const remoteData = hook.data[remoteProvider]
//     const remoteProfile = remoteData.profile
//     name = remoteProfile.displayName
//     if (remoteProfile.photos && remoteProfile.photos.length > 0) {
//       avatar = remoteProfile.photos[0].value
//     }
//   }
//
//   const { agentId } = hook.data
//
//   hook.data.profile = {
//     name,
//     // email,
//     avatar
//   }
//
//   return hook
// }

// TODO replace this with proper database transactions
// https://github.com/feathersjs/feathers-knex/issues/91
// function deleteIfCreateFailed (hook) {
//   const agents = hook.app.service('agents')
//   const profiles = hook.app.service('profiles')
//
//   const { agentId } = hook.data
//   if (!agentId) return hook
//
//   return Promise.all([
//     agents.remove({ id: agentId }),
//     profiles.find({ agentId })
//       .then((profileList) => {
//         return Promise.all(profileList.map(profile => {
//           return profiles.remove({ id: profile.id })
//         }))
//       })
//   ]).then(() => hook)
// }
