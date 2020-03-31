const { EventEmitter } = require('events')

const Events = {
    handleCallState: new EventEmitter(),
    handleWsState: new EventEmitter(),
    handleVerto: new EventEmitter(),
}

module.exports = { Events }
