const test = require('tape')

const dogstackAgents = require('../')

test('dogstack-agents', function (t) {
  t.ok(dogstackAgents, 'module is require-able')
  t.end()
})
