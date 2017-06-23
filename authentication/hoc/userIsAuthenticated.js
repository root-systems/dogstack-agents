import { connectedRouterRedirect } from 'redux-auth-wrapper/lib/history4/redirect'
import { propOr } from 'ramda'

import getCredential from '../getters/getCredential'

export default connectedRouterRedirect({
  wrapperDisplayName: 'UserIsAuthenticated',
  authSelector: getCredential,
  predicate: propOr(null, 'accessToken'),
  redirectPath: '/sign-in',
  allowRedirectBack: true
})
