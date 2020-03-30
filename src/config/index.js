const { Context } = require('../models')
const { Events } = require('../events')
const { InboundEvents, OutboundEvents } = require('../state-call')
const { StateCall } = require('../enums')
const { WsException } = require('../ws-exceptions')

let HandleVerto = null

const start = data => {
    $.verto.init({}, bootstrap(data))
}

const bootstrap = data => {
    const { agent, wssAddress, wsFallbackURL, tag, useIce } = data

    const callbacks = {
        onWSLogin,
        onWSClose,
        onWSConnect,
        onWSException,
        onDialogState,
    }

    HandleVerto = new jQuery.verto(
        {
            login: agent.login,
            passwd: agent.passwd,
            socketUrl: `wss://${wssAddress}`,
            wsFallbackURL: wsFallbackURL,
            tag: tag,
            iceServers: useIce && [{ url: 'stun:stun.freeswitch.org' }],
            deviceParams: {
                useMic: 'any',
                useSpeak: 'default',
                useCamera: 'default',
            },
            audioParams: {
                googEchoCancellation: true,
                googAutoGainControl: true,
                googNoiseSuppression: true,
                googHighpassFilter: true,
                googTypingNoiseDetection: true,
                googEchoCancellation2: false,
                googAutoGainControl2: false,
            },
        },
        callbacks
    )

    Events.handleVerto.emit('handleVerto', HandleVerto)
}

const onWSLogin = (verto, success) => {
    console.log('onWSLogin', success)
}

const onWSClose = (verto, success) => {
    console.log('onWSClose', success)
}

const onWSConnect = (verto, success) => {
    console.log('onWSConnect', success)
}

const onDialogState = d => {
    const {
        INBOUND,
        TRYING,
        RINGING,
        RECOVERING,
        EARLY,
        ANSWERING,
        ACTIVE,
        HOLD,
        HANGUP,
        DESTROY,
    } = StateCall

    if (!Context.currentCall) {
        Context.currentCall = d
        Context.inCourse = true
    }

    if (
        Context.inCourse &&
        d.direction.name === INBOUND &&
        Context.currentCall.callID !== d.callID
    ) {
        d.hangup()
        return
    }
    const direction = d.direction.name

    switch (d.state.name) {
        case TRYING:
            eventVerto(direction, null, OutboundEvents.trying, d)
            break
        case RINGING:
            eventVerto(direction, InboundEvents.ring, null, d)
            break
        case EARLY:
            eventVerto(direction, InboundEvents.early, OutboundEvents.early, d)
            break
        case ANSWERING:
            eventVerto(
                direction,
                InboundEvents.answering,
                OutboundEvents.answering,
                d
            )
            break
        case RECOVERING:
        case ACTIVE:
        case HOLD:
            eventVerto(direction, InboundEvents.active, OutboundEvents.active)
            break
        case HANGUP:
            eventVerto(
                direction,
                InboundEvents.hangup,
                OutboundEvents.hangup,
                d
            )
            break
        case DESTROY:
            if (Context.currentCall.callID === d.callID) {
                Context.inCourse = false
                Context.currentCall = null
            }

            eventVerto(direction, InboundEvents.destroy, OutboundEvents.destroy)
            break
    }
}

const onWSException = e => {
    let reason = ''
    switch (e) {
        case 1000:
            reason = WsException.CLOSE_NORMAL
            break
        case 1001:
            reason = WsException.CLOSE_GOING_AWAY
            break
        case 1002:
            reason = WsException.CLOSE_PROTOCOL_ERROR
            break
        case 1003:
            reason = WsException.CLOSE_UNSUPPORTED
            break
        case 1005:
            reason = WsException.CLOSE_NO_STATUS
            break
        case 1006:
            reason = WsException.CLOSE_ABNORMAL
            break
        case 1007:
            reason = WsException.UNSUPPORTED_DATA
            break
        case 1008:
            reason = WsException.POLICY_VIOLATION
            break
        case 1009:
            reason = WsException.CLOSE_TOO_LARGE
            break
        case 1010:
            reason = WsException.MISSING_EXTENSION
            break
        case 1011:
            reason = WsException.INTERNAL_ERROR
            break
        case 1012:
            reason = WsException.SERVICE_RESTART
            break
        case 1013:
            reason = WsException.TRY_AGAIN_LATER
            break
        case 1015:
            reason = WsException.TLS_HANDSHAKE
            break
        default:
            reason = WsException.DEFAULT_STATUS
    }
}

const eventVerto = (
    direction,
    InboundEvents,
    OutboundEvents,
    dialog = null
) => {
    direction === StateCall.INBOUND
        ? InboundEvents(dialog)
        : OutboundEvents(dialog)
}

const Config = {
    start,
}

module.exports = { Config }
