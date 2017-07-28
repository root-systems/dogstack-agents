const { createStructuredSelector } = require('reselect')

const getRegisterError = require('./getRegisterError')
const getAuthenticationConfig = require('./getAuthenticationConfig')

module.exports = createStructuredSelector({
  config: getAuthenticationConfig,
  error: getRegisterError
})
