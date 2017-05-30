import { createStructuredSelector } from 'reselect'

import getAuthenticationError from './getAuthenticationError'

export default createStructuredSelector({
  error: getAuthenticationError
})
