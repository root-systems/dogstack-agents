import test from 'ava'
import freeze from 'deep-freeze'
import { localUpdater } from '../updater'
import {
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
} from '../actions'

test('REGISTER_START', function (t) {
  const cid = Symbol('cid')
  const initialState = {}
  freeze(initialState)
  const newState = localUpdater(registerStart(cid))(initialState)
  t.is(newState.credential, null)
  t.true(newState.isRegistering)
})

test('REGISTER_SUCCESS', function (t) {
  const cid = Symbol('cid')
  const initialState = {}
  freeze(initialState)
  const newcredential = {name: 'test', email: 'derp@dog.com', id: 1}
  const newState = localUpdater(registerSuccess(cid, newcredential))(initialState)
  t.deepEqual(newState.credential, newcredential)
  t.false(newState.isRegistering)
})

test('REGISTER_ERROR', function (t) {
  const cid = Symbol('cid')
  const initialState = {}
  const error = 'bang!'
  freeze(initialState)
  const newState = localUpdater(registerError(cid, error))(initialState)
  t.is(newState.registerError, error)
})

test('SIGN_IN_SUCCESS', function (t) {
  const cid = Symbol('cid')
  const initialState = {}
  freeze(initialState)
  const newcredential = {name: 'test', email: 'derp@dog.com'}
  const newState = localUpdater(signInSuccess(cid, newcredential))(initialState)
  t.is(newState.credential, newcredential)
  t.false(newState.isSigningIn)
})

test('LOG_OUT', function (t) {
  const cid = Symbol('cid')
  const initialState = {name: 'test', email: 'derp@dog.com'}
  freeze(initialState)
  const newState = localUpdater(logOut(cid))(initialState)
  t.is(newState.credential, null)
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
  t.is(newState.credential, null)
  t.true(newState.isSigningIn)
})
