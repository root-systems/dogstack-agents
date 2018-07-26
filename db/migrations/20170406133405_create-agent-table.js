// TODO: IK: which of these should be required? perhaps only email / password?
exports.up = function (knex, Promise) {
  return knex.schema.createTableIfNotExists('agents', function (table) {
    table.increments('id')
    table.enum('type', ['person', 'group', 'bot']).defaultTo('person')
    table.string('password')
    table.string('email').unique()
    table.text('name')
    table.text('description')
    table.text('avatar')
    table.string('googleId').unique()
    table.string('facebookId').unique()
    table.string('githubId').unique()
    table.string('twitterId').unique()
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('agents')
}
