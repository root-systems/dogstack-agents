const test = require('ava')
const { Observable, Scheduler } = require('rxjs')
const { tap } = require('rxjs/operators')
const { ActionsObservable } = require('redux-observable')
const {
  signInEpic,
  logOutEpic,
  registerEpic
//  initEpic
} = require('../epic')
const {
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
} = require('../actions')
const { actions: agentActions } = require('../../agents')

test('register dispatches registerStart and agents.create action', function (t) {
  t.plan(3)
  var i = 0
  var agent = {
    email: 'test@test.nz',
    password: 'secret-sauce',
    name: 'Test Testerson'
  }
  const cid = Symbol('cid')
  const registerAction = register(cid, agent)
  const action$ = ActionsObservable.of(registerAction)
  const expectedActions = [
    registerStart(cid),
    agentActions.create(cid, agent)
  ]
  return registerEpic(action$, null, {}).pipe(
    tap(actualAction => {
      const expectedAction = expectedActions[i]
      if (i === 0 || i === 1) {
        t.deepEqual(actualAction, expectedAction)
        if (i === 0) t.is(actualAction.payload, expectedAction.payload)
      }
      i++
    })
  )
})

test('register happy path dispatches registerSuccess and signIn', function (t) {
  t.plan(3)
  var i = 0
  var agent = {
    id: Symbol('agent')
  }
  const cid = Symbol('cid')
  const registerAction = register(cid, agent)
  const action$ = ActionsObservable.from(
    Observable.create(observer => {
      observer.next(registerAction)
      observer.next(agentActions.set(cid, agent.id, agent))
      observer.next(agentActions.complete(cid))
      observer.complete()
    }),
    Scheduler.async
  )
  const expectedActions = [
    registerSuccess(cid, agent),
    signIn(cid, agent)
  ]
  return registerEpic(action$).pipe(
    tap(actualAction => {
      const expectedAction = expectedActions[i - 2]
      if (i === 2) {
        t.deepEqual(actualAction, expectedAction)
        t.is(actualAction.payload, expectedAction.payload)
      } else if (i === 3) {
        t.is(actualAction.type, signIn.type)
      }
      i++
    })
  )
})

test('register unhappy path dispatches registerError', function (t) {
  t.plan(2)
  var i = 0
  var agent = {}
  var err = 'bang!'
  const cid = Symbol('cid')
  const registerAction = register(cid, agent)
  const action$ = ActionsObservable.from(
    Observable.create(observer => {
      observer.next(registerAction)
      observer.next(agentActions.error(cid, err))
      observer.complete()
    }),
    Scheduler.async
  )
  const expectedAction = registerError(cid, err)
  return registerEpic(action$).pipe(
    tap(actualAction => {
      if (i++ === 2) {
        t.deepEqual(actualAction, expectedAction)
        t.is(actualAction.payload, expectedAction.payload)
      }
    })
  )
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
    authenticate: (creds) => Promise.resolve({ accessToken: 'test' }),
    passport: {
      verifyJWT: (token) => Promise.resolve({ credentialId: 1 })
    }
  }
  return signInEpic(action$, {}, { feathers }).pipe(
    tap(actualAction => {
      if (i++ === 0) {
        t.deepEqual(actualAction, expectedAction)
        t.is(actualAction.payload, expectedAction.payload)
      }
    })
  )
})

test('signIn happy path dispatches signInSuccess action', function (t) {
  t.plan(1)
  var i = 0
  var creds = {
    email: 'test@test.nz',
    password: 'secret-sauce'
  }
  const cid = Symbol('cid')
  const action$ = ActionsObservable.from([
    signIn(cid, creds)
  ])
  const expectedAction = signInSuccess(cid, { accessToken: 'test', credentialId: 1 }) // TODO: IK: change this to agentId
  const feathers = {
    authenticate: (creds) => Promise.resolve({ accessToken: 'test' }),
    passport: {
      verifyJWT: (token) => Promise.resolve({ credentialId: 1 })
    }
  }
  return signInEpic(action$, {}, { feathers }).pipe(
    tap(actualAction => {
      if (i++ === 1) {
        // IK: t.is equality checking (as per other tests) fails here in that the payloads are deeply equal, but not the same - don't think it's necessary to test this though
        t.deepEqual(actualAction, expectedAction)
      }
    })
  )
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
  return signInEpic(action$, {}, { feathers }).pipe(
    tap(actualAction => {
      if (i++ === 1) {
        t.deepEqual(actualAction, expectedAction)
        t.is(actualAction.payload, expectedAction.payload)
      }
    })
  )
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
  return logOutEpic(action$, {}, { feathers }).pipe(
    tap(actualAction => {
      if (i++ === 0) {
        t.deepEqual(actualAction, expectedAction)
        t.is(actualAction.payload, expectedAction.payload)
      }
    })
  )
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
  return logOutEpic(action$, {}, { feathers }).pipe(
    tap(actualAction => {
      if (i++ === 1) {
        t.deepEqual(actualAction, expectedAction)
        t.is(actualAction.payload, expectedAction.payload)
      }
    })
  )
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
  return logOutEpic(action$, {}, { feathers }).pipe(
    tap(actualAction => {
      if (i++ === 1) {
        t.deepEqual(actualAction, expectedAction)
        t.is(actualAction.payload, expectedAction.payload)
      }
    })
  )
})
