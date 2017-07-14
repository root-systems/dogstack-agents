import locationHelperBuilder from 'redux-auth-wrapper/lib/history4/locationHelper'
import { connectedRouterRedirect } from 'redux-auth-wrapper/lib/history4/redirect'

import getIsNotAuthenticated from '../getters/getIsNotAuthenticated'

const locationHelper = locationHelperBuilder({})

export default connectedRouterRedirect({
  wrapperDisplayName: 'UserIsNotAuthenticated',
  authSelector: getIsNotAuthenticated,
  predicate: Boolean,
  redirectPath: (state, ownProps) => locationHelper.getRedirectQuery(ownProps) || '/',
  allowRedirectBack: false
})
