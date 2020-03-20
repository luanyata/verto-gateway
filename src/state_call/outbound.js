const OutBoundEvents = {
    trying: null,
    early: null,
    answering: null,
    active: null,
    hangup: null,
    destroy: null,
}

OutBoundEvents.trying = () => {
    console.log('Trying Outbound')
}

OutBoundEvents.early = () => {
    console.log('Early Outbound')
}

OutBoundEvents.answering = () => {
    console.log('Answering Outbound')
}

OutBoundEvents.active = () => {
    console.log('Active Outbound')
}

OutBoundEvents.hangup = () => {
    console.log('Hangup Outbound')
}

OutBoundEvents.destroy = () => {
    console.log('Destroy Outbound')
}

module.exports = { OutBoundEvents }
