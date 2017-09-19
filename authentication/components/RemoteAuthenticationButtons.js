const h = require('react-hyperscript')
const { pipe, map, mapObjIndexed, values, mergeAll } = require('ramda')

const RemoteAuthenticationButton = require('./RemoteAuthenticationButton')

// TODO get this config from the redux store
const remoteAuthenticationMethods = window.config.authentication.remote

module.exports = RemoteAuthenticationButtons

function RemoteAuthenticationButtons (allProps) {
  const { styles } = allProps

  const buttons = pipe(
    mapObjIndexed((method, name) => {
      const methodProps = mergeAll([method, { name }, allProps])
      return h(RemoteAuthenticationButton, methodProps)
    }),
    values
  )(remoteAuthenticationMethods)

  const buttonItems = map(button => (
    h('li', {
      className: styles.remote
    }, [
      button
    ])
  ))

  return (
    h('ul', {
      className: styles.remotes
    }, [
      buttonItems(buttons)
    ])
  )
}
