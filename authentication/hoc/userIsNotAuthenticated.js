const locationHelperBuilder = require('redux-auth-wrapper/history4/locationHelper').default
const { connectedRouterRedirect } = require('redux-auth-wrapper/history4/redirect')

const getIsNotAuthenticated = require('../getters/getIsNotAuthenticated')

const locationHelper = locationHelperBuilder({})

module.exports = connectedRouterRedirect({
  wrapperDisplayName: 'UserIsNotAuthenticated',
  authenticatedSelector: getIsNotAuthenticated,
  redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/',
  allowRedirectBack: false
})
