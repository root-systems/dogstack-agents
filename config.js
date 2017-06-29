module.exports = {
  authentication: {
    strategies: [
      'local',
      'jwt',
      'oauth2'
    ],
    service: 'credentials',
    entity: 'credential',
    local: {
      service: 'credentials',
      entity: 'credential'
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
