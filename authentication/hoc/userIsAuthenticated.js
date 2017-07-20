import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect'

import getIsAuthenticated from '../getters/getIsAuthenticated'

export default connectedRouterRedirect({
  wrapperDisplayName: 'UserIsAuthenticated',
  authenticatedSelector: getIsAuthenticated,
  redirectPath: '/sign-in'
})
