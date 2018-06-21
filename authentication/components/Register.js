const h = require('react-hyperscript')
const { connect: connectFela } = require('react-fela')
const { Field, reduxForm: connectForm } = require('redux-form')
const { mapObjIndexed } = require('ramda')
const compose = require('recompose/compose').default
const { TextField } = require('redux-form-material-ui')
const Button = require('@material-ui/core/Button').default
const { required, email, length, confirmation } = require('@root-systems/redux-form-validators')
const { FormattedMessage } = require('dogstack/intl')

const styles = require('../styles/Register')
const RemoteAuthenticationMethods = require('../containers/RemoteAuthenticationButtons')

// https://blog.codinghorror.com/the-god-login/

const LocalAuthenticationForm = compose(
  connectForm({
    form: 'localAuthenticationForm'
  })
)(props => {
  const { styles, handleSubmit, navigateToSignIn } = props

  return (
    h('form', {
      onSubmit: handleSubmit,
      className: styles.form
    }, [
      h(Field, {
        name: 'name',
        label: (
          h(FormattedMessage, {
            id: 'agents.nameLabel',
            className: styles.labelText
          })
        ),
        fullWidth: true,
        component: TextField,
        validate: required()
      }),
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
        component: TextField,
        validate: email()
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
        component: TextField,
        validate: length({ min: 8 })
      }),
      h(Field, {
        name: 'passwordConfirm',
        type: 'password',
        label: (
          h(FormattedMessage, {
            id: 'agents.confirmPassword',
            className: styles.labelText
          })
        ),
        fullWidth: true,
        component: TextField,
        validate: confirmation({ field: 'password', fieldLabel: 'Password' })
      }),
      h('div', {
        className: styles.actions
      }, [
        h(Button, {
          type: 'submit',
          variant: 'raised',
          color: 'primary',
          className: styles.registerAction
        }, [
          h(FormattedMessage, {
            id: 'agents.createAccount',
            className: styles.labelText
          })
        ]),
        h(Button, {
          type: 'submit',
          variant: 'raised',
          color: 'secondary',
          className: styles.signInAction,
          onClick: navigateToSignIn
        }, [
          h(FormattedMessage, {
            id: 'agents.signIn',
            className: styles.labelText
          })
        ]),
      ])
    ])
  )
})

const Register = compose(
  connectFela(styles)
)(props => {
  const { styles, appName, error, actions } = props

  return (
    h('div', {
      className: styles.container
    }, [
      h('p', {
        className: styles.intro
      }, [
        h(FormattedMessage, {
          id: 'agents.welcome',
          className: styles.labelText,
          values: {
            appName
          }
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
        onSubmit: actions.authentication.register,
        navigateToSignIn
      })
    ])
  )

  function navigateToSignIn () {
    actions.router.push('/sign-in')
  }
})

module.exports = Register
