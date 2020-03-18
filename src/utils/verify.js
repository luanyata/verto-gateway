const isNullOrUndefined = value => value === null || value === undefined

const isNullOrUndefinedOrEmpty = value =>
    isNullOrUndefined(value) || value === ''

module.exports = { isNullOrUndefined, isNullOrUndefinedOrEmpty }
