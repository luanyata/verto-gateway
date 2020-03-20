const { EventEmitter } = require('events')

const Events = {
    handleVerto: new EventEmitter(),
}

module.exports = { Events }
