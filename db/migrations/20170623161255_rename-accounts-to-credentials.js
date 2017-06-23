exports.up = function (knex, Promise) {
  return knex.schema.renameTable('accounts', 'credentials')
}

exports.down = function (knex, Promise) {
  return knex.schema.renameTable('credentials', 'accounts')
}
