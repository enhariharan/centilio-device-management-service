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
    // first get a list of all available devices
    console.info('url: ' + url);
    restler.get(url)
    .on('complete', (result, response) => {
      // Validate that we got the list of device properly
      assert(result !== null);
      assert(result.devices !== null && result.devices.length > 0);
      result.devices.forEach(device => {
        // From this list, validate specifically the device readings of the device named 'device 1'
        if (device.name === 'device 1') {
          console.info('device: ' + JSON.stringify(device));
          restler.get(url+'/'+device.uuid+'/deviceReadings')
          .on('complete', (result, response) => {
            assert(result !== null);
            assert(result.deviceReadings !== null);
            assert(result.deviceReadings.length > 0);
            result.deviceReadings.forEach(dr => {
              console.info('\nchecking device reading: ' + JSON.stringify(dr));
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
