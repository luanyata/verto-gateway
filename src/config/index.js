const $ = require('verto/src/jquery.verto')
const { WsEvent } = require('../enums')
const { StateCall } = require('../state_call')
const { InboundEvents } = require('../state_call/inbound')
const { OutBoundEvents } = require('../state_call/outbound')

const Config = {
    bootstrap: null,
    start: null,
}

const HandleVerto = null

Config.start = start = data => {
    $.verto.init({}, bootstrap(data))
}

Config.bootstrap = bootstrap = data => {
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

onWSLogin = (verto, success) => {
    console.log('onWSLogin', success)
}

onWSClose = (verto, success) => {
    console.log('onWSClose', success)
}

onWSConnect = (verto, success) => {
    console.log('onWSConnect', success)
}

onDialogState = d => {
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
            eventVerto(direction, null, OutBoundEvents.tryingOutbound, d)
            break
        case RINGING:
            eventVerto(direction, InboundEvents.ringingInbound, null, d)
            break
        case EARLY:
            eventVerto(
                direction,
                InboundEvents.earlyInbound,
                OutBoundEvents.earlyOutBound,
                d
            )
            break
        case ANSWERING:
            eventVerto(
                direction,
                InboundEvents.answeringInbound,
                OutBoundEvents.answeringOutBound,
                d
            )
            break
        case RECOVERING:
        case ACTIVE:
        case HOLD:
            eventVerto(
                direction,
                InboundEvents.activeInbound,
                OutBoundEvents.activeOutbound
            )
            break
        case HANGUP:
            eventVerto(
                direction,
                InboundEvents.hangupInbound,
                OutBoundEvents.hangupOutbound,
                d
            )
            break
        case DESTROY:
            eventVerto(
                direction,
                InboundEvents.destroyInbound,
                OutBoundEvents.destroyOutbound
            )
            break
    }
}

onWSException = e => {
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
    InboundEventsbound,
    OutBoundEventsbound,
    dialog = null
) => {
    direction === StateCall.INBOUND
        ? InboundEventsbound(dialog)
        : OutBoundEventsbound(dialog)
}

module.exports = { HandleVerto, Config }
