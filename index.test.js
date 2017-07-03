import test from 'ava'

import * as dogstackAgents from './'

test('dogstack-agents', function (t) {
  t.truthy(dogstackAgents, 'module is require-able')
})
