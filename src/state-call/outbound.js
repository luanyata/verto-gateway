const OutboundEvents = {
    trying: null,
    early: null,
    answering: null,
    active: null,
    hangup: null,
    destroy: null,
}

OutboundEvents.trying = () => {
    console.log('Trying Outbound')
}

OutboundEvents.early = () => {
    console.log('Early Outbound')
}

OutboundEvents.answering = () => {
    console.log('Answering Outbound')
}

OutboundEvents.active = () => {
    console.log('Active Outbound')
}

OutboundEvents.hangup = () => {
    console.log('Hangup Outbound')
}

OutboundEvents.destroy = () => {
    console.log('Destroy Outbound')
}

module.exports = { OutboundEvents }
