import locationHelperBuilder from 'redux-auth-wrapper/lib/history4/locationHelper'
import { connectedRouterRedirect } from 'redux-auth-wrapper/lib/history4/redirect'
import { pipe, propOr, not } from 'ramda'

import getCredential from '../getters/getCredential'

const locationHelper = locationHelperBuilder({})

export default connectedRouterRedirect({
  wrapperDisplayName: 'UserIsNotAuthenticated',
  authSelector: getCredential,
  predicate: pipe(propOr(null, 'accessToken'), not),
  redirectPath: (state, ownProps) => locationHelper.getRedirectQuery(ownProps) || '/',
  allowRedirectBack: false
})
