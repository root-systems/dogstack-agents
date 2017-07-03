import { createStructuredSelector } from 'reselect'

import getRegisterError from './getRegisterError'
import getAuthenticationConfig from './getAuthenticationConfig'

export default createStructuredSelector({
  config: getAuthenticationConfig,
  error: getRegisterError
})
