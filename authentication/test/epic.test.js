import test from 'ava'
import { Observable, Scheduler } from 'rxjs'
import { ActionsObservable } from 'redux-observable'
import {
  signInEpic,
  logOutEpic,
  registerEpic
//  initEpic
} from '../epic'
import {
  signIn,
  signInStart,
  signInSuccess,
  signInError,
  logOut,
  logOutStart,
  logOutSuccess,
  logOutError,
  registerStart,
  registerSuccess,
  registerError,
  register
} from '../actions'
import { actions as credentialActions } from '../../credentials'

test('register dispatches registerStart and credentials.create action', function (t) {
  t.plan(3)
  var i = 0
  var credential = {
    email: 'test@test.nz',
    password: 'secret-sauce'
  }
  const cid = Symbol('cid')
  const registerAction = register(cid, credential)
  const action$ = ActionsObservable.of(registerAction)
  const expectedActions = [
    registerStart(cid),
    credentialActions.create(cid, credential)
  ]
  return registerEpic(action$, null, {})
    .do(actualAction => {
      const expectedAction = expectedActions[i]
      if (i === 0 || i === 1) {
        t.deepEqual(actualAction, expectedAction)
        if (i === 0) t.is(actualAction.payload, expectedAction.payload)
      }
      i++
    })
})

test('register happy path dispatches registerSuccess and signIn', function (t) {
  t.plan(3)
  var i = 0
  var credential = {
    id: Symbol('credential')
  }
  const cid = Symbol('cid')
  const registerAction = register(cid, credential)
  const action$ = ActionsObservable.from(
    Observable.create(observer => {
      observer.next(registerAction)
      observer.next(credentialActions.set(cid, credential.id, credential))
      observer.next(credentialActions.complete(cid))
      observer.complete()
    }),
    Scheduler.async
  )
  const expectedActions = [
    registerSuccess(cid, credential)
    // signIn(cid, credential)
  ]
  return registerEpic(action$)
    .do(actualAction => {
      const expectedAction = expectedActions[i - 2]
      if (i === 2) {
        t.deepEqual(actualAction, expectedAction)
        t.is(actualAction.payload, expectedAction.payload)
      } else if (i === 3) {
        t.is(actualAction.type, signIn.type)
      }
      i++
    })
})

// this legit fails because bug in feathers-action
// where actions.error.type is undefined
test('register unhappy path dispatches registerError', function (t) {
  t.plan(2)
  var i = 0
  var credential = {}
  var err = 'bang!'
  const cid = Symbol('cid')
  const registerAction = register(cid, credential)
  const action$ = ActionsObservable.from(
    Observable.create(observer => {
      observer.next(registerAction)
      observer.next(credentialActions.error(cid, err))
      observer.complete()
    }),
    Scheduler.async
  )
  const expectedAction = registerError(cid, err)
  return registerEpic(action$)
    .do(actualAction => {
      if (i++ === 2) {
        t.deepEqual(actualAction, expectedAction)
        t.is(actualAction.payload, expectedAction.payload)
      }
    })
})

test('signIn dispatches signInStart action', function (t) {
  t.plan(2)
  var i = 0
  const cid = Symbol('cid')
  const action$ = ActionsObservable.from([
    signIn(cid)
  ])
  const expectedAction = signInStart(cid)
  const feathers = {
    authenticate: () => Promise.resolve()
  }
  return signInEpic(action$, {}, { feathers })
    .do(actualAction => {
      if (i++ === 0) {
        t.deepEqual(actualAction, expectedAction)
        t.is(actualAction.payload, expectedAction.payload)
      }
    })
})

test('signIn happy path dispatches signInSuccess action', function (t) {
  t.plan(2)
  var i = 0
  var creds = {}
  const cid = Symbol('cid')
  const action$ = ActionsObservable.from([
    signIn(cid, creds)
  ])
  const expectedAction = signInSuccess(cid, creds)
  const feathers = {
    authenticate: (creds) => Promise.resolve(creds)
  }
  return signInEpic(action$, {}, { feathers })
    .do(actualAction => {
      if (i++ === 1) {
        t.deepEqual(actualAction, expectedAction)
        t.is(actualAction.payload, expectedAction.payload)
      }
    })
})

test('signIn unhappy path dispatches signInError', function (t) {
  t.plan(2)
  var i = 0
  var err = {}
  const cid = Symbol('cid')
  const action$ = ActionsObservable.from([
    signIn(cid)
  ])
  const expectedAction = signInError(cid, err)
  const feathers = {
    authenticate: (creds) => Promise.reject(err)
  }
  return signInEpic(action$, {}, { feathers })
    .do(actualAction => {
      if (i++ === 1) {
        t.deepEqual(actualAction, expectedAction)
        t.is(actualAction.payload, expectedAction.payload)
      }
    })
})

test('logOut dispatches logOutStart action', function (t) {
  t.plan(2)
  var i = 0
  const cid = Symbol('cid')
  const action$ = ActionsObservable.from([
    logOut(cid)
  ])
  const expectedAction = logOutStart(cid)
  const feathers = {
    logout: () => Promise.resolve()
  }
  return logOutEpic(action$, {}, { feathers })
    .do(actualAction => {
      if (i++ === 0) {
        t.deepEqual(actualAction, expectedAction)
        t.is(actualAction.payload, expectedAction.payload)
      }
    })
})

test('logOut happy path dispatches logOutSuccess action', function (t) {
  t.plan(2)
  var i = 0
  const cid = Symbol('cid')
  const action$ = ActionsObservable.from([
    logOut(cid)
  ])
  const expectedAction = logOutSuccess(cid)
  const feathers = {
    logout: () => Promise.resolve()
  }
  return logOutEpic(action$, {}, { feathers })
    .do(actualAction => {
      if (i++ === 1) {
        t.deepEqual(actualAction, expectedAction)
        t.is(actualAction.payload, expectedAction.payload)
      }
    })
})

test('logOut unhappy path dispatches logOutError', function (t) {
  t.plan(2)
  var i = 0
  var err = {}
  const cid = Symbol('cid')
  const action$ = ActionsObservable.from([
    logOut(cid)
  ])
  const expectedAction = logOutError(cid, err)
  const feathers = {
    logout: (creds) => Promise.reject(err)
  }
  return logOutEpic(action$, {}, { feathers })
    .do(actualAction => {
      if (i++ === 1) {
        t.deepEqual(actualAction, expectedAction)
        t.is(actualAction.payload, expectedAction.payload)
      }
    })
})
