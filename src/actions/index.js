const { isNullOrUndefinedOrEmpty } = require('../utils')
const { HandleVerto } = require('../config')
const { KeyStorage } = require('../storage')
const { Context } = require('../state_call')

const Actions = {
    call: null,
    answerCall: null,
    dtmf: null,
    hangup: null,
    mute: null,
    unmute: null,
    hold: null,
    unhold: null,
    logout: null,
}

Actions.call = call = destination => {
    if (isNullOrUndefinedOrEmpty(destination)) {
        throw Error('Digite o numero do destinatário')
    }

    const currentUser = sessionStorage
        .getItem(KeyStorage.EXTENSION)
        .split('@')[0]

    Context.currentCall = HandleVerto.newCall({
        destination_number: destination,
        caller_id_name: currentUser,
        caller_id_number: currentUser,
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

Actions.answerCall = answerCall = () => {
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

Actions.dtmf = dtmf = digit => Context.currentCall.dtmf(digit)

Actions.hangup = hangup = () => HandleVerto.hangup()

Actions.mute = mute = () => Context.currentCall.setMute('off')

Actions.unmute = unmute = () => Context.currentCall.setMute('on')

Actions.hold = hold = () => Context.currentCall.hold()

Actions.unhold = unhold = () => Context.currentCall.unhold()

Actions.logout = logout = () => HandleVerto.logout()

module.exports = { Actions }
