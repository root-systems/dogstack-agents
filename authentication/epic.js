const { combineEpics, ofType } = require('redux-observable')
const { Observable, of, concat: indexConcat, from, empty, merge: indexMerge } = require('rxjs')
const { delay, switchMap, mergeMap, catchError, concat, filter, take, withLatestFrom, map, mapTo } = require('rxjs/operators')
const createCid = require('incremental-id')
const { push } = require('react-router-redux')

const { actions: agents } = require('../agents')
// const { actions: credentials } = require('../credentials')
// const { actions: profiles } = require('../profiles')
const {
  signIn, signInStart, signInSuccess, signInError,
  logOut, logOutStart, logOutSuccess, logOutError,
  register, registerStart, registerSuccess, registerError
} = require('./actions')

module.exports = combineEpics(initEpic, signInEpic, logOutEpic, registerEpic)

module.exports.initEpic = initEpic
function initEpic (action$) {
  return of(signIn(createCid()))
  // .pipe(
  //   delay(0) // apparently needs delay otherwise action lost
  // )
}

module.exports.signInEpic = signInEpic
function signInEpic (action$, store, { feathers }) {
  return action$.pipe(
    ofType(signIn.type),
    switchMap(({ payload, meta: { cid } }) => indexConcat(
      of(signInStart(cid)),
      from(
        feathers.authenticate(payload)
          .then(({ accessToken }) => {
            return feathers.passport.verifyJWT(accessToken)
              .then((result) => {
                const { credentialId } = result
                return { accessToken, credentialId }
              })
          })
      ).pipe(
        mergeMap(({ accessToken, credentialId }) => {
          // what is credentialId?? looks like it's probably agentId now
          // in which case the other method below could be 'fetchAgent'
          return indexConcat(
            of(signInSuccess(cid, { accessToken, credentialId })),
            fetchAgentByCredential(action$, cid, credentialId)
          )
        }),
        // mergeMap(actions => of(...actions))
        // can't swallow error as part of promise chain
        // because we want to not emit an action, rather than undefined.
        catchError((err) => {
          // if init signIn() fails, it's not an error
          if (err.message === 'Could not find stored JWT and no authentication strategy was given') return empty()
          return of(signInError(cid, err))
        })
      )
    ))
  )
}

module.exports.logOutEpic = logOutEpic
function logOutEpic (action$, store, { feathers }) {
  return action$.pipe(
    ofType(logOut.type),
    switchMap(({ meta: { cid } }) => indexConcat(
      of(logOutStart(cid)),
      from(
        feathers.logout()
          .then(() => logOutSuccess(cid))
      ).pipe(
        concat(of(push('/'))), // TODO this should be configurable
        catchError((err) => of(logOutError(cid, err)))
      )
    ))
  )
}

module.exports.registerEpic = registerEpic
function registerEpic (action$, store, deps) {
  return action$.pipe(
    ofType(register.type),
    switchMap(action => {
      const { payload } = action
      const { email, password, name } = payload
      const { cid } = action.meta

      const createdSuccess$ = action$.pipe(ofType(agents.complete.type), filter(onlyCid), take(1))
      const createdError$ = action$.pipe(ofType(agents.error.type), filter(onlyCid), take(1))
      // get only the last set item, since it should be the latest
      const createdSet$ = action$.pipe(ofType(agents.set.type), filter(onlyCid))
      const signInSuccess$ = action$.pipe(ofType(signInSuccess.type), filter(onlyCid), take(1))

      // TODO create initial profile with name
      return indexMerge(
        of(
          registerStart(cid),
          agents.create(cid, { email, password, name })
        ),
        createdSuccess$.pipe(
          withLatestFrom(createdSet$, (success, set) => set.payload.data),
          mergeMap(created => {
            return of(
              registerSuccess(cid, created),
              signIn(cid, { strategy: 'local', email, password })
            )
          })
        ),
        createdError$.pipe(map(action => registerError(cid, action.payload))),
        signInSuccess$.pipe(mapTo(push('/'))) // TODO this should be configurable
      )

      function onlyCid (action) {
        return action.meta.cid === cid
      }
    })
  )
}

// IK: shouldn't need all of this now that profiles and credentials all in agents table
function fetchAgentByCredential (action$, cid, credentialId) {
  const agentSet$ = action$.pipe(ofType(agents.set.type), filter(onlyCid))
  // const credentialSet$ = action$.pipe(ofType(credentials.set.type), filter(onlyCid))
  // const profileSet$ = action$.pipe(ofType(profiles.set.type), filter(onlyCid))

  return indexMerge(
    // of(credentials.get(cid, credentialId)),
    // credentialSet$.pipe(
    //   mergeMap(action => {
    //     const { agentId } = action.payload.data
    //     return of(
    //       credentials.complete(cid),
    //       // agents.get(cid, agentId),
    //       profiles.find(cid, { query: { agentId } })
    //     )
    //   })
    // ),
    // agents.get(cid, agentId),
    // profileSet$.pipe(map(() => profiles.complete(cid))),
    agentSet$.pipe(map(() => agents.complete(cid)))
  )

  function onlyCid (action) {
    return action.meta.cid === cid
  }
}
