const { connect } = require('react-redux')

const SignOut = require('../components/signOut')

const { signOut } = require('../actions')

module.exports = connect(
  null,
  { signOut }
)(SignOut)
