import { connectedRouterRedirect } from 'redux-auth-wrapper/lib/history4/redirect'

import getIsAuthenticated from '../getters/getIsAuthenticated'

export default connectedRouterRedirect({
  wrapperDisplayName: 'UserIsAuthenticated',
  authSelector: getIsAuthenticated,
  predicate: Boolean,
  redirectPath: '/sign-in',
  allowRedirectBack: true
})
