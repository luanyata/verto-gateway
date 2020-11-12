const Store = require('../store');
const Events = require('../events');

const callIds = [];

const OutboundEvents = {
  trying: null,
  active: null,
  hangup: null,
  destroy: null,
};

OutboundEvents.trying = (call) => {
  callIds.push(call.callID);

  if (Store.inCourse) {
    Store.HandleVerto.hangup(call.callID);
  } else {
    console.log('Trying Outbound');
    Store.firstCallID = call.callID;
    Store.inCourse = true;
    Events.handleCallState.emit('TRYING', true);
  }
};

OutboundEvents.active = () => {
  console.log('Active Outbound');
  Events.handleCallState.emit('OUTBOUND_ACTIVE', true);
};

OutboundEvents.hangup = (dialog) => {
  console.log('Hangup Inbound');
  Events.handleCallState.emit('OUTBOUND_HANGUP_CAUSE', dialog.cause);

  if (Store.currentCall.callID === Store.firstCallID) {
    Store.inCourse = false;
  }
};

OutboundEvents.destroy = () => {
  if (callIds.pop() === Store.firstCallID) {
    Store.firstCallID = '';
    Store.currentCall = null;
    Store.inCourse = false;
    Events.handleCallState.emit('OUTBOUND_ACTIVE', false);
  }
};

module.exports = OutboundEvents;
