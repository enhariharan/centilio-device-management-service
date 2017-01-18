var assert = require('chai').assert,
    mongoose = require('mongoose'),
    restler = require('restler'),
    utilities = require('../../models/utilities'),
    Device = require('../../models/device-model').Device,

    credentials = require('../../credentials.js'),
    opts = { server: { socketOptions: { keepAlive: 1 } } },
    dbConnection = mongoose.createConnection(credentials.mongo.test.connectionString, opts),

    baseurl = 'http://localhost:' + credentials.server.port,
    url = baseurl + '/devices';

suite('devices router integration tests - ', () => {
  test('get device readings for given device uuid', (done) => {
    // first get device details for device1Client1Corp1
    restler.get(url/*, { method: 'get', username: 'userClient1Corp1', password: 'password' }*/)
    .on('complete', function(response) {
      console.info('complete');
      console.info('result: ' + JSON.stringify(result));
      console.info('response: ' + JSON.stringify(response));
    })
    .on('success', (response) => {
      console.info('success');
      console.info('data: ' + JSON.stringify(data));
      console.info('response: ' + JSON.stringify(response));
    })
    .on('fail', (response) => {
      console.info('fail');
      console.info('data: ' + JSON.stringify(data));
      console.info('response: ' + JSON.stringify(response));
    })
    .on('error', (response) => {
      console.info('error');
      console.info('err: ' + JSON.stringify(err));
      console.info('response: ' + JSON.stringify(response));
    })
    .on('200', (response) => {
      console.info('200');
      console.info('data: ' + JSON.stringify(data));
      console.info('response: ' + JSON.stringify(response));
    });
    done();
  });
});

dbConnection.close();
