const h = require('react-hyperscript')
const { connect: connectFela } = require('react-fela')
const { Field, reduxForm: connectForm } = require('redux-form')
const compose = require('recompose/compose').default
const { mapObjIndexed, merge } = require('ramda')
const { TextField } = require('redux-form-material-ui')
const Button = require('@material-ui/core/Button').default
const { FormattedMessage } = require('dogstack/intl')

const styles = require('../styles/SignIn')
const RemoteAuthenticationMethods = require('../containers/RemoteAuthenticationButtons')

// https://blog.codinghorror.com/the-god-login/

const LocalAuthenticationForm = compose(
  connectForm({
    form: 'localAuthenticationForm'
  })
)(props => {
  const { styles, handleSubmit, signIn, navigateToRegister } = props

  return (
    h('form', {
      onSubmit: handleSubmit(localAuth),
      className: styles.form
    }, [
      h(Field, {
        name: 'email',
        type: 'email',
        label: (
          h(FormattedMessage, {
            id: 'agents.email',
            className: styles.labelText
          })
        ),
        fullWidth: true,
        component: TextField
      }),
      h(Field, {
        name: 'password',
        type: 'password',
        label: (
          h(FormattedMessage, {
            id: 'agents.password',
            className: styles.labelText
          })
        ),
        fullWidth: true,
        component: TextField
      }),
      h('div', {
        className: styles.actions
      }, [
        h(Button, {
          type: 'submit',
          variant: 'raised',
          color: 'primary',
          className: styles.signInAction
        }, [
          h(FormattedMessage, {
            id: 'agents.signIn',
            className: styles.labelText
          })
        ]),
        h(Button, {
          type: 'submit',
          variant: 'raised',
          color: 'secondary',
          className: styles.registerAction,
          onClick: navigateToRegister
        }, [
          h(FormattedMessage, {
            id: 'agents.createAccount',
            className: styles.labelText
          })
        ]),
      ])
    ])
  )

  function localAuth (payload) {
    signIn(merge(payload, { strategy: 'local' }))
  }
})

const SignIn = compose(
  connectFela(styles)
)(props => {
  const { styles, error, actions } = props

  return (
    h('div', {
      className: styles.container
    }, [
      h('p', {
        className: styles.intro
      }, [
        h(FormattedMessage, {
          id: 'agents.signInWith',
          className: styles.labelText
        })
      ]),
      h('ul', {
        className: styles.remotes
      }, [
        h(RemoteAuthenticationMethods, {
          styles,
          signIn: actions.authentication.signIn
        })
      ]),
      error && (
        h('div', {
          className: styles.error
        }, [
          error.message
        ])
      ),
      h(LocalAuthenticationForm, {
        styles,
        signIn: actions.authentication.signIn,
        navigateToRegister
      })
    ])
  )

  function navigateToRegister () {
    actions.router.push('/register')
  }
})

module.exports = SignIn
