const createAction = require('@f/create-action')

const payloadCtor = (cid, payload) => payload
const metaCtor = (cid) => ({ cid })

exports.signIn = createAction('SIGN_IN', payloadCtor, metaCtor)
exports.signInStart = createAction('SIGN_IN_START', payloadCtor, metaCtor)
exports.signInSuccess = createAction('SIGN_IN_SUCCESS', payloadCtor, metaCtor)
exports.signInError = createAction('SIGN_IN_ERROR', payloadCtor, metaCtor)

exports.logOut = createAction('LOG_OUT', payloadCtor, metaCtor)
exports.logOutStart = createAction('LOG_OUT_START', payloadCtor, metaCtor)
exports.logOutSuccess = createAction('LOG_OUT_SUCCESS', payloadCtor, metaCtor)
exports.logOutError = createAction('LOG_OUT_ERROR', payloadCtor, metaCtor)

exports.register = createAction('REGISTER', payloadCtor, metaCtor)
exports.registerStart = createAction('REGISTER_START', payloadCtor, metaCtor)
exports.registerSuccess = createAction('REGISTER_SUCCESS', payloadCtor, metaCtor)
exports.registerError = createAction('REGISTER_ERROR', payloadCtor, metaCtor)
