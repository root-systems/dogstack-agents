const { connect } = require('react-redux')

const Register = require('../components/register')

const { register } = require('../actions')

module.exports = connect(
  null,
  { register }
)(Register)
