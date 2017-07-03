import { createStructuredSelector } from 'reselect'

import getSignInError from './getSignInError'
import getAuthenticationConfig from './getAuthenticationConfig'

export default createStructuredSelector({
  config: getAuthenticationConfig,
  error: getSignInError
})
