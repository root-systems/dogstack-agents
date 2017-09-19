const { bindActionCreators } = require('redux')
const { connect: connectRedux } = require('react-redux')
const { connect: connectFeathers } = require('feathers-action-react')
const { merge } = require('ramda')
const compose = require('recompose/compose').default
const { push } = require('react-router-redux')

const { getRegisterProps } = require('../../getters')
const { authentication } = require('../../actions')
const { register, signIn } = authentication

const Register = require('../components/Register')

module.exports = compose(
  connectFeathers({
    selector: getRegisterProps,
    actions: { authentication: { register, signIn } },
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
)(Register)
