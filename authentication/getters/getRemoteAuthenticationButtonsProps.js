const { createStructuredSelector } = require('reselect')

const getAuthenticationConfig = require('./getAuthenticationConfig')

module.exports = createStructuredSelector({
  config: getAuthenticationConfig
})
