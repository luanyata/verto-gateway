const { Events } = require('../events')
const { Ring } = require('../ring')
const { Context } = require('../store')
const { HandleVerto } = require('../config')

const callIds = [];

const InboundEvents = {
    ring: null,
    answering: null,
    active: null,
    hangup: null,
    destroy: null,
}

InboundEvents.ring = ({ call, autoAnswer }) => {

    callIds.push(call.callID)

    if (Context.inCourse) {
        HandleVerto.hangup(call.callID)
    } else {
        console.log('Ring Inbound')
        Events.handleCallState.emit('bina', call.params.caller_id_number)
        Events.handleCallState.emit('receiveCall', call)
        Ring.start()
        Context.firstCallID = call.callID;
        context.inCourse = true;
    }

    if (autoAnswer) {
        call.answer({
            outgoingBandwidth: 'default',
            incomingBandwidth: 'default',
            useStereo: false,
            useVideo: false,
            useCamera: false,
            useSpeak: 'default',
            screenShare: false,
            dedEnc: false,
            mirrorInput: false,
        })
    }
}

InboundEvents.answering = () => {
    Ring.end()
    console.log('Answering Inbound')
    Events.handleCallState.emit('answering', true)
}

InboundEvents.active = () => {
    console.log('Active Inbound')
    Events.handleCallState.emit('active', true)
}

InboundEvents.hangup = (dialog) => {
    Events.handleCallState.emit('hangupCause', dialog.cause)
    console.log('Hangup Inbound')
    Ring.end()

    if (Context.currentCall.callID === Context.firstCallID) {
        Context.inCourse = false;
    }
}

InboundEvents.destroy = () => {
    if (callIds.pop() === Context.firstCallID || callIds.length === 0) {
        Context.currentCall = null;
        Context.inCourse = false;
        Context.firstCallID = '';
        Events.handleCallState.emit('active', false)
        Events.handleCallState.emit('answering', false)
    }
}

module.exports = { InboundEvents }
