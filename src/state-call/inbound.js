const Events = require('../events');
const Ring = require('../ring');
const Store = require('../store');

const callIds = [];

const InboundEvents = {
  ring: null,
  answering: null,
  active: null,
  hangup: null,
  destroy: null,
};

InboundEvents.ring = ({ call, autoAnswer }) => {
  callIds.push(call.callID);

  if (Store.inCourse) {
    Store.HandleVerto.hangup(call.callID);
  } else {
    console.log('Ring Inbound');
    Events.handleCallState.emit('BINA', call.params.caller_id_number);
    Events.handleCallState.emit('RECEIVE_CALL', call);
    Ring.start();
    Store.firstCallID = call.callID;
    Store.inCourse = true;
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
    });
  }
};

InboundEvents.answering = () => {
  console.log('Answering Inbound');
  Ring.end();
  Events.handleCallState.emit('ANSWERING', true);
};

InboundEvents.active = () => {
  console.log('Active Inbound');
  Events.handleCallState.emit('INBOUND_ACTIVE', true);
};

InboundEvents.hangup = (dialog) => {
  console.log('Hangup Inbound');
  Events.handleCallState.emit('INBOUND_HANGUP_CAUSE', dialog.cause);
  Ring.end();

  if (Store.currentCall.callID === Store.firstCallID) {
    Store.inCourse = false;
  }
};

InboundEvents.destroy = () => {
  if (callIds.pop() === Store.firstCallID || callIds.length === 0) {
    Store.currentCall = null;
    Store.inCourse = false;
    Store.firstCallID = '';
    Events.handleCallState.emit('INBOUND_ACTIVE', false);
    Events.handleCallState.emit('ANSWERING', false);
  }
};

module.exports = InboundEvents;
