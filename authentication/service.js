const { keys, assign } = Object
const { authenticate } = require('feathers-authentication').hooks
const local = require('feathers-authentication-local')
const jwt = require('feathers-authentication-jwt')
const oauth2 = require('feathers-authentication-oauth2')

const remotePlugins = { oauth2 }

// authenticate the user using the a JWT or
// email/password strategy and if successful
// return a new JWT access token.

module.exports = function () {
  const app = this
  const config = app.get('authentication')

  app
  .configure(jwt())
  .configure(local(config.local))

  keys(config.remote).forEach(name => {
    const provider = config.remote[name]
    const plugin = remotePlugins[provider.type]
    if (!plugin) return
    app.configure(plugin(assign(provider, { name })))
  })
  

  app.service('authentication').hooks({
    before: {
      create: [
        authenticate(config.strategies)
      ]
    }
  })
}
