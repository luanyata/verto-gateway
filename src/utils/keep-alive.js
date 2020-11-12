const Store = require('../store');

const KeepAlive = () => {
  const bytesToSendAndReceive = 1024 * 16;
  Store.HandleVerto.rpcClient.speedTest(bytesToSendAndReceive, () => console.log('pong'));
};

module.exports = KeepAlive;
