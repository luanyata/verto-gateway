const { Events } = require('../events')
const { vertoHandle } = require('../config')
const { keyStorage } = require('../storage')

const BandWidthTest = () => {
    const bytesToSendAndReceive = 1024 * 256

    vertoHandle.rpcClient.speedTest(bytesToSendAndReceive, (event, data) => {
        const upBand = Math.ceil(data.upKPS)
        const downBand = Math.ceil(data.downKPS)

        sessionStorage.setItem(keyStorage.IN_BAND_WIDTH, String(downBand))
        sessionStorage.setItem(keyStorage.OUT_BAND_WIDTH, String(upBand))

        Events.dataBandWidth.emit({ upBand, downBand })
    })
}

module.exports = { BandWidthTest }
