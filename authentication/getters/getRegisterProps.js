const { createStructuredSelector } = require('reselect')

const getRegisterError = require('./getRegisterError')
const getAppName = require('./getAppName')
const getAuthenticationConfig = require('./getAuthenticationConfig')

module.exports = createStructuredSelector({
  appName: getAppName,
  authConfig: getAuthenticationConfig,
  error: getRegisterError
})
