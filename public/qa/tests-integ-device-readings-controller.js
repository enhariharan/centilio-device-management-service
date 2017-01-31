var assert = require('chai').assert,
    mongoose = require('mongoose'),
    restler = require('restler'),
    utilities = require('../../src/models/utilities'),

    credentials = require('../../src/app/configuration'),
    opts = { server: { socketOptions: { keepAlive: 1 } } },
    dbConnection = mongoose.createConnection(credentials.mongo.test.connectionString, opts),

    baseurl = 'http://localhost:' + credentials.server.port,
    url = baseurl + '/deviceReadings';

suite('device readings router integration tests - ', function() {

  test('add new device reading', (done) => {
    var testUserName = 'userclient1Corp1',
        testPassword = 'password',
        deviceReading = {
          timestamp: utilities.getTimestamp(),
          device: '01234567890',
          readings: [
            {type: 'latitude', value: '17.264333'},
            {type: 'longitude', value: '78.234667'},
            {type: 'charging status', value: 'discharging'},
            {type: 'current charge', value: '76'}
          ]
        };

    restler.postJson(url, deviceReading, { method: 'post', username: testUserName, password:  testPassword })
    .on('complete', (result, res) => {
      assert(result !== null && result !== '' && result !== undefined);
      assert(result.uuid !== null);
      assert(result.timestamp !== null);
      assert(result.serverTimestamp !== null);
      assert(result.device === deviceReading.device);
      assert(result.readings !== null);
      result.readings.forEach(r => {
        assert(r.type !== null);
        assert(r.type === 'latitude' || r.type === 'longitude' || r.type === 'charging status' || r.type === 'current charge');
        assert(r.value !== null);
        if (r.type === 'latitude') assert(r.value === '17.264333');
        else if (r.type === 'longitude') assert(r.value === '78.234667');
        else if (r.type === 'charging status') assert(r.value === 'discharging');
        else if (r.type === 'current charge') assert(r.value === '76');
        else assert(false);
      });
      done();
    })
    .on('fail', (data, res) => {
      console.log('data: ' + JSON.stringify(data));
      assert(false);
      done();
    });
  });
});

dbConnection.close();
