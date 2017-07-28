const { connectedRouterRedirect } = require('redux-auth-wrapper/history4/redirect')

const getIsAuthenticated = require('../getters/getIsAuthenticated')

module.exports = connectedRouterRedirect({
  wrapperDisplayName: 'UserIsAuthenticated',
  authenticatedSelector: getIsAuthenticated,
  redirectPath: '/sign-in'
})
