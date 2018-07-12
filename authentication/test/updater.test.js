const test = require('ava')
const freeze = require('deep-freeze')
const { localUpdater } = require('../updater')
const {
//  signIn,
  signInStart,
  signInSuccess,
  signInError,
  logOut,
//  logOutStart,
//  logOutSuccess,
//  logOutError,
//  register,
  registerStart,
  registerSuccess,
  registerError
} = require('../actions')

test('REGISTER_START', function (t) {
  const cid = Symbol('cid')
  const initialState = {}
  freeze(initialState)
  const newState = localUpdater(registerStart(cid))(initialState)
  t.true(newState.isRegistering)
  t.is(newState.registerError, null)
})

test('REGISTER_SUCCESS', function (t) {
  const cid = Symbol('cid')
  const initialState = {}
  freeze(initialState)
  const newcredential = {name: 'test', email: 'derp@dog.com', id: 1}
  const newState = localUpdater(registerSuccess(cid, newcredential))(initialState)
  t.false(newState.isRegistering)
})

test('REGISTER_ERROR', function (t) {
  const cid = Symbol('cid')
  const initialState = {}
  const error = 'bang!'
  freeze(initialState)
  const newState = localUpdater(registerError(cid, error))(initialState)
  t.false(newState.isRegistering)
  t.is(newState.registerError, error)
})

test('SIGN_IN_SUCCESS', function (t) {
  const cid = Symbol('cid')
  const initialState = {}
  freeze(initialState)
  const newPayload = { accessToken: 'test', credentialId: 23 }
  const newState = localUpdater(signInSuccess(cid, newPayload))(initialState)
  t.is(newState.accessToken, newPayload.accessToken)
  t.is(newState.credentialId, newPayload.credentialId)
  t.false(newState.isSigningIn)
})

test('LOG_OUT_SUCCESS', function (t) {
  const cid = Symbol('cid')
  const initialState = {name: 'test', email: 'derp@dog.com'}
  freeze(initialState)
  const newState = localUpdater(logOut(cid))(initialState)
  t.is(newState.accessToken, null)
  t.is(newState.credentialId, null)
})

test('SIGN_IN_ERROR', function (t) {
  const cid = Symbol('cid')
  const initialState = {}
  const error = 'bang!'
  freeze(initialState)
  const newState = localUpdater(signInError(cid, error))(initialState)
  t.is(newState.signInError, error)
  t.false(newState.isSigningIn)
})

test('SIGN_IN_START', function (t) {
  const cid = Symbol('cid')
  const initialState = {}
  freeze(initialState)
  const newState = localUpdater(signInStart(cid))(initialState)
  t.is(newState.signInError, null)
  t.true(newState.isSigningIn)
})
