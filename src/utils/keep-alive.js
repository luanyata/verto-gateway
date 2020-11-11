const KeepAlive = () => {
    const bytesToSendAndReceive = 1024 * 16;
    vertoHandle.rpcClient.speedTest(bytesToSendAndReceive, (event, data) => {
        console.log('pong')
    });
};


module.exports = { KeepAlive }