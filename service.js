const services = [
  require('./agents/service'),
  require('./accounts/service'),
  require('./authentication/service')
]

module.exports = function () {
  const app = this
  services.forEach(service => {
    app.configure(service)
  })
}
