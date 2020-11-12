const Events = require('../events');
const Store = require('../store');
const keyStorage = require('../storage');

const BandWidthTest = () => {
  const bytesToSendAndReceive = 1024 * 256;

  Store.HandleVerto.rpcClient.speedTest(bytesToSendAndReceive, (_, data) => {
    const upBand = Math.ceil(data.upKPS);
    const downBand = Math.ceil(data.downKPS);

    sessionStorage.setItem(keyStorage.IN_BAND_WIDTH, String(downBand));
    sessionStorage.setItem(keyStorage.OUT_BAND_WIDTH, String(upBand));

    Events.dataBandWidth.emit({ upBand, downBand });
  });
};

module.exports = BandWidthTest;
