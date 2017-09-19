const { connect: connectRedux } = require('react-redux')
const compose = require('recompose/compose').default

const getRemoteAuthenticationButtonsProps = require('../getters/getRemoteAuthenticationButtonsProps')
const RemoteAuthenticationButtons = require('../components/RemoteAuthenticationButtons')

module.exports = compose(
  connectRedux(
    getRemoteAuthenticationButtonsProps
  )
)(RemoteAuthenticationButtons)

