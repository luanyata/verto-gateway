const { Context } = require('./')
const { vertoHandle } = require('../config/')
const { startRing, endRing } = require('../utils')
const { keyStorage } = require('../storage')
const { Events } = require('../events')

const calls = []
const InboundEvents = {
    ring: null,
    early: null,
    answering: null,
    active: null,
    hangup: null,
    destroy: null,
}

InboundEvents.ring = ({ callID }) => {
    calls.push(callID)

    if (Context.inCourse) {
        vertoHandle.hangup(callID)
    } else {
        startRing()
        Context.firstCallID = Context.currentCall.callID
        Events.callReceiver.emit(Context.currentCall)
        Context.inCourse = true

        if (JSON.parse(localStorage.getItem(keyStorage.AUTO_ANSWER))) {
            Events.callAnswered.emit()
        }
    }
}

InboundEvents.early = () => {
    console.log('Early Inbound')
}

InboundEvents.answering = dialog => {
    endRing()
    if (dialog.params.useVideo) {
        Events.isVideoCall.emit(true)
    }
    Events.calling.emit(true)
    Events.callCurrent.emit(true)
}

InboundEvents.active = () => {
    Events.calling.emit(true)
    Events.callCurrent.emit(true)
}

InboundEvents.hangup = dialog => {
    console.log(`Chamada encerrada. Motivo: ${dialog.cause}`)
    endRing()
    if (dialog.params.useVideo) {
        Events.isVideoCall.emit(false)
    }

    if (Context.currentCall.callID === Context.firstCallID) {
        Context.inCourse = false
    }
}

InboundEvents.destroy = () => {
    if (calls.pop() === Context.firstCallID || calls.length === 0) {
        Context.currentCall = null
        Context.inCourse = false
        Context.firstCallID = ''
        Events.callCurrent.emit(false)
        Events.calling.emit(false)
        Events.missedCall.emit(true)
    }
}

module.exports = { InboundEvents }
