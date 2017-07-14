const createModule = require('feathers-action')

const dux = createModule('credentials')

export default dux
export const actions = dux.actions
export const updater = dux.updater
export const epic = dux.epic
