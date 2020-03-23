const { Events } = require('../events')
const { Context } = require('../models')
const { isNullOrUndefinedOrEmpty } = require('../utils')

let HandleVerto = null

Events.handleVerto.on('handleVerto', handle => (HandleVerto = handle))

const Actions = {
    call: null,
    answer: null,
    dtmf: null,
    hangup: null,
    mute: null,
    unmute: null,
    hold: null,
    unhold: null,
    logout: null,
}

Actions.call = (origin, destination) => {
    if (isNullOrUndefinedOrEmpty(destination)) {
        console.warn('Digite o numero do destinatário')
        return
    }

    Context.currentCall = HandleVerto.newCall({
        destination_number: destination,
        caller_id_name: origin,
        caller_id_number: origin,
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

Actions.answer = () => {
    Context.currentCall.answer({
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

Actions.dtmf = digit => Context.currentCall.dtmf(digit)

Actions.hangup = () => HandleVerto.hangup()

Actions.mute = () => Context.currentCall.setMute('off')

Actions.unmute = () => Context.currentCall.setMute('on')

Actions.hold = () => Context.currentCall.hold()

Actions.unhold = () => Context.currentCall.unhold()

Actions.logout = () => HandleVerto.logout()

module.exports = { Actions }
