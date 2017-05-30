module.exports = {
  getAgents: require('./agents/getters/getAgents'),
  getAccounts: require('./accounts/getters/getAccounts'),
  getAuthentication: require('./authentication/getters/getAuthentication'),
  getAccount: require('./authentication/getters/getAccount'),
  getAccessToken: require('./authentication/getters/getAccessToken'),
  getSigningIn: require('./authentication/getters/getSigningIn'),
  getIsAuthenticated: require('./authentication/getters/getIsAuthenticated'),
  getIsNotAuthenticated: require('./authentication/getters/getIsNotAuthenticated'),
  getAuthenticationError: require('./authentication/getters/getAuthenticationError'),
}
