const h = require('react-hyperscript')
const RaisedButton = require('material-ui/RaisedButton').default
const FontIcon = require('material-ui/FontIcon').default

module.exports = RemoteAuthenticationMethod

function RemoteAuthenticationMethod (props) {
  const {
    name,
    label,
    icon,
    backgroundColor,
    signIn
  } = props

  return (
    h(RaisedButton, {
      label,
      icon: h(FontIcon, { className: icon }),
      backgroundColor,
      fullWidth: true,
      onClick: handleClick
    })
  )

  function handleClick (ev) {
    const url = `/auth/${name}`
    const title = `Cobuy sign in with ${name}`

    listenSignInPopup(openSignInPopup({ url, title }))
  }

  function listenSignInPopup (popup) {
    if (popup.closed) {
      console.log('cancel!')
      // cancel()
    } else {
      let token
      try {
        token = popup.token
      } catch (err) {}
      if (token && token.accessToken) {
        const { accessToken } = token
        signIn({ strategy: 'jwt', accessToken })
        popup.close()
      } else {
        setTimeout(() => listenSignInPopup(popup), 0)
      }
    }
  }
}

/*
 * A helper function that opens the provided URL in a centered popup.
 * Accepts an `options` object with `width` and `height` number properties.
 */
// = require(https://github.com/feathersjs/feathers-authentication-popups/blob/master/src/feathers-authentication-popups.js
function openSignInPopup (options = {}) {
  const { url, title } = options
  var width = options.width || 1024
  var height = options.height || 640
  var { top, left } = getCenterCoordinates(window, width, height)
  var params = `width=${width}, height=${height}, top=${top}, left=${left}`
  return window.open(url, title, params)
}

/*
 * Returns the coordinates to center a popup window in the viewport with
 * the provided width and height args.
 */
// = require(https://github.com/feathersjs/feathers-authentication-popups/blob/master/src/feathers-authentication-popups.js
function getCenterCoordinates (window, width, height) {
  return {
    left: window.screenX + ((window.outerWidth - width) / 2),
    top: window.screenY + ((window.outerHeight - height) / 2)
  }
}
