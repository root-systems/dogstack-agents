const { createSelector } = require('reselect')
const { complement } = require('ramda')

const getIsAuthenticated = require('./getIsAuthenticated')

module.exports = complement(getIsAuthenticated)
