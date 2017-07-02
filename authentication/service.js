const { keys, assign } = Object
const assert = require('assert')
const authentication = require('feathers-authentication')
const { authenticate } = authentication.hooks
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
  assert(authConfig, 'must set `authentication` in config.')

  const authConfig = app.get('authentication')

  app
  .configure(authentication(authConfig))
  .configure(jwt())
  .configure(local(config.local))

  keys(config.remote).forEach(name => {
    const provider = config.remote[name]
    const plugin = remotePlugins[provider.type]
    if (!plugin) return
    app.configure(plugin(assign(provider, { name, formatter: remoteFormatter })))
  })

  app.service('authentication').hooks({
    before: {
      create: [
        authenticate(config.strategies)
      ]
    }
  })
}

function remoteFormatter (req, res, next) {
  const token = res.data
  var template = `
    <html>
      <head>
        <script>
          window.token = JSON.parse('${JSON.stringify(token)}')
        </script>
      </head>
      <body></body>
    </html>
  `

  res.format({
    'text/html': function () {
      res.send(template)
    }
  })
}
