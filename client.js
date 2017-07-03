const auth = require('feathers-authentication-client')

module.exports = function () {
  const app = this

  const localStorage = window ? window.localStorage : null

  app.configure(auth({
    storage: localStorage,
    accessTokenKey: 'dogstack'
  }))

  return app
}
