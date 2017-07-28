const { updateStateAt, combine, withDefaultState, decorate } = require('redux-fp')

const accessToken = action => (state = null) => {
  switch (action.type) {
    case 'SIGN_IN_SUCCESS':
      return action.payload.accessToken
    case 'LOG_OUT_SUCCESS':
      return null
    default:
      return state
  }
}

const credentialId = action => (state = null) => {
  switch (action.type) {
    case 'SIGN_IN_SUCCESS':
      return action.payload.credentialId
    case 'LOG_OUT_SUCCESS':
      return null
    default:
      return state
  }
}

const isSigningIn = action => (state = false) => {
  switch (action.type) {
    case 'SIGN_IN_START':
      return true
    case 'SIGN_IN_SUCCESS':
    case 'SIGN_IN_ERROR':
      return false
    default:
      return state
  }
}

const isRegistering = action => (state = false) => {
  switch (action.type) {
    case 'REGISTER_START':
      return true
    case 'REGISTER_SUCCESS':
    case 'REGISTER_ERROR':
      return false
    default:
      return state
  }
}

const signInError = action => (state = null) => {
  switch (action.type) {
    case 'SIGN_IN_START':
      return null
    case 'SIGN_IN_ERROR':
      console.error(action.payload)
      return action.payload
    default:
      return state
  }
}

const registerError = action => (state = null) => {
  switch (action.type) {
    case 'REGISTER_START':
      return null
    case 'REGISTER_ERROR':
      console.error(action.payload)
      return action.payload
    default:
      return state
  }
}

const localUpdater = decorate(
  withDefaultState({}),
  combine({
    accessToken,
    credentialId,
    isSigningIn,
    signInError,
    isRegistering,
    registerError
  })
)

const globalDecorator = decorate(
  withDefaultState({}),
  updateStateAt('authentication'),
  localUpdater
)

exports = module.exports = globalDecorator
exports.localUpdater = localUpdater
exports.globalDecorator = globalDecorator
