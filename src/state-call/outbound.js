const { Context } = require('../store');
const { HandleVerto } = require('../config')
const { Events } = require('../events')

const callIds = [];

const OutboundEvents = {
    trying: null,
    active: null,
    hangup: null,
    destroy: null,
}

OutboundEvents.trying = (call) => {
    callIds.push(call.callID)

    if (Context.inCourse) {
        HandleVerto.hangup(call.callID)
    } else {
        Context.firstCallID = call.callID;
        Context.inCourse = true;
        Events.handleCallState.emit('calling', true);
    }
    console.log('Trying Outbound')
}

OutboundEvents.active = () => {
    console.log('Active Outbound')
    Events.handleCallState.emit('active', true)
}

OutboundEvents.hangup = (dialog) => {
    Events.handleCallState.emit('hangupCause', dialog.cause)
    console.log('Hangup Inbound')

    if (Context.currentCall.callID === Context.firstCallID) {
        Context.inCourse = false;
    }
}

OutboundEvents.destroy = () => {
    if (callIds.pop() === Context.firstCallID) {
        Context.firstCallID = '';
        Context.currentCall = null;
        Context.inCourse = false;
        Events.handleCallState.emit('active', false)
    }
}

module.exports = { OutboundEvents }
