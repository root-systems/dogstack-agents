const { combineEpics } = require('redux-observable')
const Rx = require('rxjs')
const createCid = require('incremental-id')
const { push } = require('react-router-redux')

const { actions: agents } = require('../agents')
const { actions: credentials } = require('../credentials')
const { actions: profiles } = require('../profiles')
const {
  signIn, signInStart, signInSuccess, signInError,
  logOut, logOutStart, logOutSuccess, logOutError,
  register, registerStart, registerSuccess, registerError
} = require('./actions')

module.exports = combineEpics(initEpic, signInEpic, logOutEpic, registerEpic)

exports.initEpic = initEpic
function initEpic () {
  return Rx.Observable.of(signIn(createCid()))
    .delay(0) // apparently needs delay otherwise action lost
}

exports.signInEpic = signInEpic
function signInEpic (action$, store, { feathers }) {
  return action$.ofType(signIn.type)
    .switchMap(({ payload, meta: { cid } }) => Rx.Observable.concat(
      Rx.Observable.of(signInStart(cid)),
      Rx.Observable.fromPromise(
        feathers.authenticate(payload)
          .then(({ accessToken }) => {
            return feathers.passport.verifyJWT(accessToken)
              .then(({ credentialId }) => {
                return { accessToken, credentialId }
              })
          })
        )
        .mergeMap(({ accessToken, credentialId }) => {
          return Rx.Observable.concat(
            Rx.Observable.of(signInSuccess(cid, { accessToken, credentialId })),
            fetchAgentByCredential(action$, cid, credentialId)
          )
        })
        //.mergeMap(actions => Rx.Observable.of(...actions))
        // can't swallow error as part of promise chain
        // because we want to not emit an action, rather than undefined.
        .catch((err) => {
          // if init signIn() fails, it's not an error
          if (err.message === 'Could not find stored JWT and no authentication strategy was given') return Rx.Observable.empty()
          return Rx.Observable.of(signInError(cid, err))
        })
    ))
}

exports.logOutEpic = logOutEpic
function logOutEpic (action$, store, { feathers }) {
  return action$.ofType(logOut.type)
    .switchMap(({ meta: { cid } }) => Rx.Observable.concat(
      Rx.Observable.of(logOutStart(cid)),
      Rx.Observable.fromPromise(
        feathers.logout()
          .then(() => logOutSuccess(cid))
      )
        .concat(Rx.Observable.of(push('/'))) // TODO this should be configurable
        .catch((err) => Rx.Observable.of(logOutError(cid, err)))
    ))
}

exports.registerEpic = registerEpic
function registerEpic (action$, store, deps) {
  return action$.ofType(register.type)
    .switchMap(action => {
      const { payload } = action
      const { email, password } = payload
      const { cid } = action.meta

      const createdSuccess$ = action$.ofType(credentials.complete.type).filter(onlyCid).take(1)
      const createdError$ = action$.ofType(credentials.error.type).filter(onlyCid).take(1)
      // get only the last set item, since it should be the latest
      const createdSet$ = action$.ofType(credentials.set.type).filter(onlyCid)
      const signInSuccess$ = action$.ofType(signInSuccess.type).filter(onlyCid).take(1)

      // TODO create initial profile with name
      return Rx.Observable.merge(
        Rx.Observable.of(
          registerStart(cid),
          credentials.create(cid, { email, password })
        ),
        createdSuccess$
          .withLatestFrom(createdSet$, (success, set) => set.payload.data)
          .mergeMap(created => {
            return Rx.Observable.of(
              registerSuccess(cid, created),
              signIn(cid, { strategy: 'local', email, password })
            )
          }),
        createdError$.map(action => registerError(cid, action.payload)),
        signInSuccess$.mapTo(push('/')) // TODO this should be configurable
      )

      function onlyCid (action) {
        return action.meta.cid === cid
      }
    })
}


function fetchAgentByCredential (action$, cid, credentialId) {
  const agentSet$ = action$.ofType(agents.set.type).filter(onlyCid)
  const credentialSet$ = action$.ofType(credentials.set.type).filter(onlyCid)
  const profileSet$ = action$.ofType(profiles.set.type).filter(onlyCid)

  return Rx.Observable.merge(
    Rx.Observable.of(credentials.get(cid, credentialId)),
    credentialSet$.mergeMap(action => {
      const { agentId } = action.payload.data
      return Rx.Observable.of(
        credentials.complete(cid),
        agents.get(cid, agentId),
        profiles.find(cid, { query: { agentId } })
      )
    }),
    profileSet$.map(() => profiles.complete(cid)),
    agentSet$.map(() => agents.complete(cid))
  )

  function onlyCid (action) {
    return action.meta.cid === cid
  }
}
