const { WsEventEnum, StateCall } = require('../enums')
const { Events } = require('../events')
const { Context, InboundEvents, OutBoundEvents } = require('../state-call')

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
            reason = WsEventEnum.CLOSE_NORMAL
            break
        case 1001:
            reason = WsEventEnum.CLOSE_GOING_AWAY
            break
        case 1002:
            reason = WsEventEnum.CLOSE_PROTOCOL_ERROR
            break
        case 1003:
            reason = WsEventEnum.CLOSE_UNSUPPORTED
            break
        case 1005:
            reason = WsEventEnum.CLOSE_NO_STATUS
            break
        case 1006:
            reason = WsEventEnum.CLOSE_ABNORMAL
            break
        case 1007:
            reason = WsEventEnum.UNSUPPORTED_DATA
            break
        case 1008:
            reason = WsEventEnum.POLICY_VIOLATION
            break
        case 1009:
            reason = WsEventEnum.CLOSE_TOO_LARGE
            break
        case 1010:
            reason = WsEventEnum.MISSING_EXTENSION
            break
        case 1011:
            reason = WsEventEnum.INTERNAL_ERROR
            break
        case 1012:
            reason = WsEventEnum.SERVICE_RESTART
            break
        case 1013:
            reason = WsEventEnum.TRY_AGAIN_LATER
            break
        case 1015:
            reason = WsEventEnum.TLS_HANDSHAKE
            break
        default:
            reason = WsEventEnum.DEFAULT_STATUS
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
    start,
}

module.exports = { Config }
