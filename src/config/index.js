const Store = require('../store');
const Events = require('../events');
const InboundEvents = require('../state-call/inbound');
const OutboundEvents = require('../state-call/outbound');
const { CallState, WSState } = require('../enums');
const WsException = require('../ws-exceptions');
const { KeepAlive } = require('../utils');

let refSetInverval = null;

const start = (data) => {
  $.verto.init({}, bootstrap(data));
};

const bootstrap = (data) => {
  const {
    agent, wssAddress, wsFallbackURL, tag, useIce,
  } = data;

  const callbacks = {
    onWSLogin,
    onWSClose,
    onWSException,
    onDialogState,
  };

  Store.HandleVerto = new jQuery.verto(
    {
      login: agent.login,
      passwd: agent.passwd,
      socketUrl: `wss://${wssAddress}`,
      wsFallbackURL,
      tag,
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
    callbacks,
  );

  Events.handleVerto.emit('handleVerto', Store.HandleVerto);
};

const onWSLogin = (_, success) => {
  if (success) {
    refSetInverval = setInterval(KeepAlive, 5000);
    Events.handleWsState.emit('wsState', WSState.LOGGED);
  } else {
    Events.handleWsState.emit('wsState', WSState.FAILED_LOGIN);
  }
};

const onWSClose = () => {
  clearInterval(refSetInverval);
  Events.handleWsState.emit('wsState', WSState.CLOSE);
};

const onDialogState = (d) => {
  const {
    INBOUND,
    TRYING,
    RINGING,
    RECOVERING,
    ANSWERING,
    ACTIVE,
    HOLD,
    HANGUP,
    DESTROY,
  } = CallState;

  if (!Store.currentCall) {
    Store.currentCall = d;
  }

  if (
    Store.inCourse
    && d.direction.name === INBOUND
    && Store.currentCall.callID !== d.callID
  ) {
    d.hangup();
    return;
  }
  const direction = d.direction.name;

  switch (d.state.name) {
    case TRYING:
      eventVerto(direction, null, OutboundEvents.trying, d);
      break;
    case RINGING:
      eventVerto(direction, InboundEvents.ring, null, { call: d, autoAnswer: !!localStorage.getItem('autoAnswer') });
      break;
    case ANSWERING:
      eventVerto(direction, InboundEvents.answering, null, d);
      break;
    case RECOVERING:
    case ACTIVE:
    case HOLD:
      eventVerto(direction, InboundEvents.active, OutboundEvents.active);
      break;
    case HANGUP:
      eventVerto(direction, InboundEvents.hangup, OutboundEvents.hangup, d);
      break;
    case DESTROY:
      eventVerto(direction, InboundEvents.destroy, OutboundEvents.destroy);
      break;
  }
};

const onWSException = (e) => {
  let reason = '';
  switch (e) {
    case 1000:
      reason = WsException.CLOSE_NORMAL;
      break;
    case 1001:
      reason = WsException.CLOSE_GOING_AWAY;
      break;
    case 1002:
      reason = WsException.CLOSE_PROTOCOL_ERROR;
      break;
    case 1003:
      reason = WsException.CLOSE_UNSUPPORTED;
      break;
    case 1005:
      reason = WsException.CLOSE_NO_STATUS;
      break;
    case 1006:
      reason = WsException.CLOSE_ABNORMAL;
      break;
    case 1007:
      reason = WsException.UNSUPPORTED_DATA;
      break;
    case 1008:
      reason = WsException.POLICY_VIOLATION;
      break;
    case 1009:
      reason = WsException.CLOSE_TOO_LARGE;
      break;
    case 1010:
      reason = WsException.MISSING_EXTENSION;
      break;
    case 1011:
      reason = WsException.INTERNAL_ERROR;
      break;
    case 1012:
      reason = WsException.SERVICE_RESTART;
      break;
    case 1013:
      reason = WsException.TRY_AGAIN_LATER;
      break;
    case 1015:
      reason = WsException.TLS_HANDSHAKE;
      break;
    default:
      reason = WsException.DEFAULT_STATUS;
  }
};

const eventVerto = (
  direction,
  InboundEvents,
  OutboundEvents,
  dialog = null,
) => {
  direction === CallState.INBOUND
    ? InboundEvents(dialog)
    : OutboundEvents(dialog);
};

const Config = {
  start,
};

module.exports = Config;
