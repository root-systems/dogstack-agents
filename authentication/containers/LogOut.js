const { connect: connectRedux } = require('react-redux')
const { connect: connectFeathers } = require('feathers-action-react')
const compose = require('recompose/compose').default

const LogOut = require('../components/LogOut')
const { authentication } = require('../../actions')
const { logOut } = authentication

module.exports = compose(
  connectFeathers({
    selector: (state, ownProps) => ownProps,
    actions: { authentication: { logOut } },
    query: []
  })
)(LogOut)
