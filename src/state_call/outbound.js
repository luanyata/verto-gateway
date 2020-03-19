const { Context } = require('./')
const { HandleVerto } = require('../config')
const { Events } = require('../events')

const OutBoundEvents = {
    trying: null,
    early: null,
    answering: null,
    active: null,
    hangup: null,
    destroy: null,
}
const calls = []

OutBoundEvents.trying = ({ callID }) => {
    calls.push(Context.currentCall.callID)

    if (Context.inCourse) {
        HandleVerto.hangup(callID)
    } else {
        Context.firstCallID = Context.currentCall.callID
        Context.inCourse = true
        Events.calling.emit(true)
    }
}

OutBoundEvents.early = ({ params }) => {
    Events.isVideoCall.emit(params.useVideo)
}

OutBoundEvents.answering = () => {
    console.log('Answering OutBound')
}

OutBoundEvents.active = () => {
    Events.calling.emit(true)
    Events.callCurrent.emit(true)
}

OutBoundEvents.hangup = dialog => {
    console.log(`Chamada encerrada. Motivo: ${dialog.cause}`)
    if (Context.currentCall.callID === Context.firstCallID) {
        Context.inCourse = false
        if (dialog.params.useVideo) {
            Events.isVideoCall.emit(false)
        }
    }
}

OutBoundEvents.destroy = () => {
    if (calls.pop() === Context.firstCallID) {
        Context.firstCallID = ''
        Context.currentCall = null
        Context.inCourse = false
        Events.callCurrent.emit(false)
        Events.calling.emit(false)
        Events.missedCall.emit(true)
    }
}

module.exports = { OutBoundEvents }
