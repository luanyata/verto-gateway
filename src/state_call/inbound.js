const InboundEvents = {
    ring: null,
    early: null,
    answering: null,
    active: null,
    hangup: null,
    destroy: null,
}

InboundEvents.ring = () => {
    console.log('Ring Inbound')
}

InboundEvents.early = () => {
    console.log('Early Inbound')
}

InboundEvents.answering = () => {
    console.log('Answering Inbound')
}

InboundEvents.active = () => {
    console.log('Active Inbound')
}

InboundEvents.hangup = () => {
    console.log('Hangup Inbound')
}

InboundEvents.destroy = () => {
    console.log('Destroy Inbound')
}

module.exports = { InboundEvents }
