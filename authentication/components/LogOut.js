const React = require('react')
const h = require('react-hyperscript')
const Button = require('@material-ui/core/Button').default
const { connect: connectFela } = require('react-fela')
const compose = require('recompose/compose').default
const { FormattedMessage } = require('dogstack/intl')
const { omit, merge } = require('ramda')
const ListItemIcon = require('@material-ui/core/ListItemIcon').default

const styles = require('../styles/LogOut')

const getMoreProps = omit(['styles', 'actions', 'as', 'onClick', 'leftIcon'])

const LogOut = compose(
  connectFela(styles)
)(props => {
  const {
    styles,
    actions,
    as: Component = Button,
    onClick,
    leftIcon = null
  } = props
  const moreProps = getMoreProps(props)
  return (
    h(Component, merge(
      {
        className: styles.container,
        onClick: (ev) => {
          if (onClick) onClick(ev)
          actions.authentication.logOut()
        }
      },
      moreProps
    ), [
      h(ListItemIcon, {}, [
        leftIcon
      ]),
      h(FormattedMessage, {
        id: 'agents.logOut',
        className: styles.buttonText
      })
    ])
  )
})

module.exports = LogOut
