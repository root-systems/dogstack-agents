const { createStructuredSelector } = require('reselect')

const getSignInError = require('./getSignInError')
const getAuthenticationConfig = require('./getAuthenticationConfig')

module.exports = createStructuredSelector({
  config: getAuthenticationConfig,
  error: getSignInError
})
