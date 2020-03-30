const { EventEmitter } = require('events')

const Events = {
    handleWsState = new EventEmitter(),
    handleVerto: new EventEmitter(),
}

module.exports = { Events }
