# dogstack-agents

dogstack plugin to provide core user functionality

- [agents](https://en.wikipedia.org/wiki/Multi-agent_system) (people, groups, or bots)
- accounts ([credentials](https://en.wikipedia.org/wiki/Credential#Information_technology))
- TODO profiles
- TODO relationships
- [authentication](https://en.wikipedia.org/wiki/Authentication)
- [authorization](https://en.wikipedia.org/wiki/Authorization)

[![we're on a mission from dog](https://i.imgflip.com/wn3bl.jpg)](https://imgflip.com/i/wn3bl)

## example

for an example using `dogstack-agents`, see [`dogstack-example`](https://github.com/dogstack/dogstack-example)

## install

```shell
npm install --save dogstack-agents
```

### post{,un}install script

after install, this module should link migrations in [`./db/migrations`](./db/migrations) to your app migrations in the same relative directory.

after uninstall, this module should unlink these linked migrations.

## usage

### `{ service, updater, epic, getters, components, hoc } = require('dogstack-agents')`

### `service`

[`feathers`](http://feathersjs.com) service to plug in to [dogstack `server.js`](https://github.com/enspiral-root-systems/dogstack#serverjs)

combines

- [`./agents/service.js`](./agents/service.js)
- [`./accounts/service.js`](./accounts/service.js)
- [`./authentication/service.js`](./authentication/service.js)

### `actions`

[`redux` actions creators](http://redux.js.org/docs/Glossary.html#action-creator)

exports `{ agents, accounts, authentication }` action creators from

- [`./agents/index.js`](./agents/index.js) `actions` from [`feathers-action`](https://github.com/ahdinosaur/feathers-action)
- [`./accounts/index.js`](./accounts/index.js) `actions` from [`feathers-action`](https://github.com/ahdinosaur/feathers-action)
- [`./authentication/actions.js`](./authentication/actions.js)

### `updater`

[`redux-fp` updater](https://github.com/rvikmanis/redux-fp#updaters-vs-reducers)

concats

- [`./agents/index.js`](./agents/index.js) `updater` from [`feathers-action`](https://github.com/ahdinosaur/feathers-action)
- [`./accounts/index.js`](./accounts/index.js) `updater` from [`feathers-action`](https://github.com/ahdinosaur/feathers-action)
- [`./authentication/updater.js`](./authentication/updater.js)

### `epic`

[`redux-observable` epic](https://redux-observable.js.org/)

combines

- [`./agents/index.js`](./agents/index.js) `epic` from [`feathers-action`](https://github.com/ahdinosaur/feathers-action)
- [`./accounts/index.js`](./accounts/index.js) `epic` from [`feathers-action`](https://github.com/ahdinosaur/feathers-action)
- [`./authentication/epic.js`](./authentication/epic.js)

### `getters`

[`reselect` getters (selectors)](https://github.com/reactjs/reselect)

exports the following getters

- [`getAgents`](./agents/getters/getAgents.js)
- [`getAgents`](./agents/getters/getAgents)
- [`getAccounts`](./accounts/getters/getAccounts)
- [`getAuthentication`](./authentication/getters/getAuthentication)
- [`getAccount`](./authentication/getters/getAccount)
- [`getAccessToken`](./authentication/getters/getAccessToken)
- [`getSigningIn`](./authentication/getters/getSigningIn)
- [`getIsAuthenticated`](./authentication/getters/getIsAuthenticated)
- [`getIsNotAuthenticated`](./authentication/getters/getIsNotAuthenticated)
- [`getAuthenticationError`](./authentication/getters/getAuthenticationError)

### `components`

React components to use in your app

exports the following components

- [`SignIn`](./authentication/containers/signIn.js)
- [`SignOut`](./authentication/containers/signOut.js)
- [`Register`](./authentication/containers/register.js)

### `hoc`

[higher-order React components](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750) to use in your app

exports the following higher-order components:

- [`UserIsAuthenticated`](./authentication/hoc/userIsAuthenticated)
- [`UserIsAuthenticatedOrHome`](./authentication/hoc/userIsAuthenticatedOrHome)
- [`UserIsNotAuthenticated`](./authentication/hoc/userIsNotAuthenticated)

## license

The Apache License

Copyright &copy; 2017 Michael Williams

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
