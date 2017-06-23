const services = [
  require('./agents/service'),
  require('./credentials/service'),
  require('./authentication/service')
]

module.exports = function () {
  const app = this
  services.forEach(service => {
    app.configure(service)
  })
}
