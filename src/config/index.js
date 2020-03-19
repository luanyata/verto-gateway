const $ = require('verto/src/jquery.verto')
const { WsEvent } = require('../enums')
const { StateCall } = require('../state_call')
const { InboundEvents } = require('../state_call/inbound')
const { OutBoundEvents } = require('../state_call/outbound')

const HandleVerto = null

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
        context,
    } = StateCall

    if (!context.currentCall) {
        context.currentCall = d
    }

    if (
        context.inCourse &&
        d.direction.name === INBOUND &&
        context.currentCall.callID !== d.callID
    ) {
        d.hangup()
        return
    }
    const direction = d.direction.name

    switch (d.state.name) {
        case TRYING:
            eventVerto(direction, null, OutBoundEvents.trying, d)
            break
        case RINGING:
            eventVerto(direction, InboundEvents.ring, null, d)
            break
        case EARLY:
            eventVerto(direction, InboundEvents.early, OutBoundEvents.early, d)
            break
        case ANSWERING:
            eventVerto(
                direction,
                InboundEvents.answering,
                OutBoundEvents.answering,
                d
            )
            break
        case RECOVERING:
        case ACTIVE:
        case HOLD:
            eventVerto(direction, InboundEvents.active, OutBoundEvents.active)
            break
        case HANGUP:
            eventVerto(
                direction,
                InboundEvents.hangup,
                OutBoundEvents.hangup,
                d
            )
            break
        case DESTROY:
            eventVerto(direction, InboundEvents.destroy, OutBoundEvents.destroy)
            break
    }
}

const onWSException = e => {
    let reason = ''
    switch (e) {
        case 1000:
            reason = WsEvent.CLOSE_NORMAL
            break
        case 1001:
            reason = WsEvent.CLOSE_GOING_AWAY
            break
        case 1002:
            reason = WsEvent.CLOSE_PROTOCOL_ERROR
            break
        case 1003:
            reason = WsEvent.CLOSE_UNSUPPORTED
            break
        case 1005:
            reason = WsEvent.CLOSE_NO_STATUS
            break
        case 1006:
            reason = WsEvent.CLOSE_ABNORMAL
            break
        case 1007:
            reason = WsEvent.UNSUPPORTED_DATA
            break
        case 1008:
            reason = WsEvent.POLICY_VIOLATION
            break
        case 1009:
            reason = WsEvent.CLOSE_TOO_LARGE
            break
        case 1010:
            reason = WsEvent.MISSING_EXTENSION
            break
        case 1011:
            reason = WsEvent.INTERNAL_ERROR
            break
        case 1012:
            reason = WsEvent.SERVICE_RESTART
            break
        case 1013:
            reason = WsEvent.TRY_AGAIN_LATER
            break
        case 1015:
            reason = WsEvent.TLS_HANDSHAKE
            break
        default:
            reason = WsEvent.DEFAULT_STATUS
    }
}

const eventVerto = (
    direction,
    InboundEvents,
    OutBoundEvents,
    dialog = null
) => {
    direction === StateCall.INBOUND
        ? InboundEvents(dialog)
        : OutBoundEvents(dialog)
}

const Config = {
    bootstrap,
    start,
}

module.exports = { HandleVerto, Config }
