const h = require('react-hyperscript')
const FlatButton = require('material-ui/FlatButton').default
const { connect: connectFela } = require('react-fela')
const compose = require('recompose/compose').default
const { FormattedMessage } = require('dogstack/intl')
const { omit, merge } = require('ramda')

const styles = require('../styles/LogOut')

const getMoreProps = omit(['styles', 'actions', 'as'])

const LogOut = compose(
  connectFela(styles)
)(props => {
  const {
    styles,
    actions,
    as: Component = FlatButton,
    // ...moreProps
  } = props
  const moreProps = getMoreProps(props)

  return (
    h(Component, merge(
      {
        className: styles.container,
        onClick: actions.authentication.logOut
      },
      moreProps
    ), [
      h(FormattedMessage, {
        id: 'agents.logOut',
        className: styles.buttonText
      })
    ])
  )
})

module.exports = LogOut
