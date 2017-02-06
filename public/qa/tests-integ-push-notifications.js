var assert = require('chai').assert;
var serverUrl = 'http://localhost:4123';
var clientSocket = null;

suite('websockets integration tests - ', () => {
  suiteSetup(() => {
    clientSocket = require('socket.io-client').connect(serverUrl);
    clientSocket.on('connect', () => {console.log('client connected');});
    clientSocket.on('disconnect', () => {console.log('client disconnected');});
    clientSocket.on('hi', (deviceUuid) => {console.log('deviceUuid; %s', deviceUuid);});
  });

  test('websocket connection must be successfully created', (done) => {
    assert(clientSocket || clientSocket !== undefined);
    console.log('clientSocket protocol: ' + JSON.stringify(clientSocket.protocol));
    console.log('clientSocket socket: ' + JSON.stringify(clientSocket.Socket().id));
    done();
  });

  // test('websocket connection object must be successfully mapped to socket id', (done) => {assert(false);});

  // test('device id must be successfully mapped to socket', (done) => {assert(false);});

  // test('client must successfully receive a message from websocket', (done) => {assert(false);});

  // test('client must successfully disconnect from websocket', (done) => {assert(false);});
});
