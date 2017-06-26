import { createStructuredSelector } from 'reselect'

import getRegisterError from './getRegisterError'

export default createStructuredSelector({
  error: getRegisterError
})
