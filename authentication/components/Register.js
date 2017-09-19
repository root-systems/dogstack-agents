const h = require('react-hyperscript')
const { connect: connectFela } = require('react-fela')
const { Field, reduxForm: connectForm } = require('redux-form')
const { mapObjIndexed } = require('ramda')
const compose = require('recompose/compose').default
const { TextField } = require('redux-form-material-ui')
const FlatButton = require('material-ui/FlatButton').default
const RaisedButton = require('material-ui/RaisedButton').default
const FontIcon = require('material-ui/FontIcon').default
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
        floatingLabelText: (
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
        floatingLabelText: (
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
        floatingLabelText: (
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
        floatingLabelText: (
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
        h(RaisedButton, {
          type: 'submit',
          label: (
            h(FormattedMessage, {
              id: 'agents.createAccount',
              className: styles.labelText
            })
          ),
          primary: true,
          className: styles.registerAction
        }),
        h(FlatButton, {
          type: 'submit',
          label: (
            h(FormattedMessage, {
              id: 'agents.signIn',
              className: styles.labelText
            })
          ),
          className: styles.signInAction,
          onClick: navigateToSignIn
        }),
      ])
    ])
  )
})

const Register = compose(
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
          id: 'agents.welcome',
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
