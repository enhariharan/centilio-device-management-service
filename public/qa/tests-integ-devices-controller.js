var assert = require('chai').assert,
    mongoose = require('mongoose'),
    restler = require('restler'),
    utilities = require('../../src/models/utilities'),
    Device = require('../../src/models/device-model').Device,

    credentials = require('../../src/app/configuration'),
    opts = { server: { socketOptions: { keepAlive: 1 } } },
    dbConnection = mongoose.createConnection(credentials.mongo.test.connectionString, opts),

    baseurl = 'http://localhost:' + credentials.server.port,
    url = baseurl + '/devices';

suite('devices router integration tests - ', () => {
  test('get device readings for given device uuid', (done) => {
    // first get a list of all available devices
    restler.get(url, {method: 'get', username: 'userClient1Corp1', password: 'password'})
    .on('complete', (result, response) => {
      // Validate that we got the list of device properly
      assert(result !== null);
      assert(result.devices !== null && result.devices.length > 0);
      result.devices.forEach(device => {
        // From this list, validate specifically the device readings of the device named 'device 1'
        if (device.name === 'device 1') {
          restler.get(url+'/'+device.uuid+'/deviceReadings', {method: 'get', username: 'userClient1Corp1', password: 'password'})
          .on('complete', (result, response) => {
            assert(result !== null);
            assert(result.deviceReadings !== null);
            assert(result.deviceReadings.length > 0);
            result.deviceReadings.forEach(dr => {
              assert(dr.device === device.uuid);
            });
            done();
          });
        }
      });
    });
  });
});

dbConnection.close();
