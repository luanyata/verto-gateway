const { EventEmitter } = require('events')

const Events = {
    calling: new EventEmitter(),
    callCurrent: new EventEmitter(),
    callReceiver: new EventEmitter(),
    callAnswered: new EventEmitter(),
    dataBandWidth: new EventEmitter(),
    handleVerto: new EventEmitter(),
    isVideoCall: new EventEmitter(),
    missedCall: new EventEmitter(),
    stateSubscriber: new EventEmitter(),
    statusWS: new EventEmitter(),
}

module.exports = { Events }
