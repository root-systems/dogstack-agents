import createAction from '@f/create-action'

const payloadCtor = (cid, payload) => payload
const metaCtor = (cid) => ({ cid })

export const signIn = createAction('SIGN_IN', payloadCtor, metaCtor)
export const signInStart = createAction('SIGN_IN_START', payloadCtor, metaCtor)
export const signInSuccess = createAction('SIGN_IN_SUCCESS', payloadCtor, metaCtor)
export const signInError = createAction('SIGN_IN_ERROR', payloadCtor, metaCtor)

export const logOut = createAction('LOG_OUT', payloadCtor, metaCtor)
export const logOutStart = createAction('LOG_OUT_START', payloadCtor, metaCtor)
export const logOutSuccess = createAction('LOG_OUT_SUCCESS', payloadCtor, metaCtor)
export const logOutError = createAction('LOG_OUT_ERROR', payloadCtor, metaCtor)

export const register = createAction('REGISTER', payloadCtor, metaCtor)
export const registerStart = createAction('REGISTER_START', payloadCtor, metaCtor)
export const registerSuccess = createAction('REGISTER_SUCCESS', payloadCtor, metaCtor)
export const registerError = createAction('REGISTER_ERROR', payloadCtor, metaCtor)

export default {
  signIn,
  signInStart,
  signInSuccess,
  signInError,
  logOut,
  logOutStart,
  logOutSuccess,
  logOutError,
  register,
  registerStart,
  registerSuccess,
  registerError
}
