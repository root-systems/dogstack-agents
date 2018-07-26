const pipe = require('ramda/src/pipe')
const path = require('ramda/src/path')
const pick = require('ramda/src/pick')
const reduce = require('ramda/src/reduce')
const toPairs = require('ramda/src/toPairs')
const assocPath = require('ramda/src/assocPath')
const __ = require('ramda/src/__')

var config = {
  authentication: {
    strategies: [
      'local',
      'jwt',
      'oauth2'
    ],
    service: 'agents',
    entity: 'agent',
    local: {
      service: 'agents',
      entity: 'agent'
    },
    remote: {
      google: {
        type: 'oauth2',
        Strategy: require('passport-google-oauth20').Strategy,
        scope: ['profile', 'email'],
        label: 'Google',
        icon: 'fa fa-google',
        backgroundColor: '#ffffff'
      },
      facebook: {
        type: 'oauth2',
        Strategy: require('passport-facebook').Strategy,
        scope: ['public_profile', 'email'],
        profileFields: ['id', 'displayName', 'photos', 'email'],
        label: 'Facebook',
        icon: 'fa fa-facebook',
        backgroundColor: '#3b5998'
      },
      github: {
        type: 'oauth2',
        Strategy: require('passport-github').Strategy,
        scope: ['user'],
        label: 'GitHub',
        icon: 'fa fa-github',
        backgroundColor: '#6d6d6d'
      }
    }
  }
}

// set browser config
const authRemotePath = ['authentication', 'remote']
const pickBrowserRemoteConfig = pick(['label', 'icon', 'backgroundColor'])
const getBrowserConfig = pipe(
  path(authRemotePath),
  toPairs,
  reduce((sofar, [name, remote]) => {
    const browserConfig = pickBrowserRemoteConfig(remote)
    return assocPath([name], browserConfig, sofar)
  }, {}),
  assocPath(authRemotePath, __, {})
)

config.browser = getBrowserConfig(config)

module.exports = config
