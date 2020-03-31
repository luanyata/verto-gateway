const { Events } = require('../events')
const { Ring } = require('../ring')

const InboundEvents = {
    ring: null,
    early: null,
    answering: null,
    active: null,
    hangup: null,
    destroy: null,
}

InboundEvents.ring = ({ params }) => {
    Events.handleCallState.emit('bina', params.caller_id_number)
    console.log('Ring Inbound')
    Ring.start()
}

InboundEvents.early = () => {
    console.log('Early Inbound')
}

InboundEvents.answering = () => {
    console.log('Answering Inbound')
    Ring.end()
}

InboundEvents.active = () => {
    console.log('Active Inbound')
}

InboundEvents.hangup = () => {
    console.log('Hangup Inbound')
    Ring.end()
}

InboundEvents.destroy = () => {
    console.log('Destroy Inbound')
}

module.exports = { InboundEvents }
