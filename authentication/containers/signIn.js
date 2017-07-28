const { connect } = require('react-redux')

const SignIn = require('../components/signIn')

const { signIn } = require('../actions')
const getSignInProps = require('../getters/getSignInProps')

module.exports = connect(
  getSignInProps,
  {signIn}
)(SignIn)
