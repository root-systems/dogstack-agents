const { bindActionCreators } = require('redux')
const { connect: connectRedux } = require('react-redux')
const { connect: connectFeathers } = require('feathers-action-react')
const { merge } = require('ramda')
const compose = require('recompose/compose').default
const { push } = require('react-router-redux')

const { authentication } = require('../../actions')
const { signIn } = authentication
const { getSignInProps } = require('../../getters')

const SignIn = require('../components/SignIn')

module.exports = compose(
  connectFeathers({
    selector: getSignInProps,
    actions: { authentication: { signIn } },
    query: []
  }),
  // we want to pass router.push action down.
  // can't use connect feathers because that
  // wraps every action creator in a cid creator.
  // TODO fix this.
  connectRedux(
    null,
    (dispatch, props) => merge(props, {
      actions: merge(props.actions, {
        router: bindActionCreators({ push }, dispatch)
      })
    })
  )
)(SignIn)
