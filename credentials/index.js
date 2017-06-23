const createModule = require('feathers-action')

const module = createModule('credentials')

export default module
export const actions = module.actions
export const updater = module.updater
export const epic = module.epic
