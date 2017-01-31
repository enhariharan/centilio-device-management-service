var loadtest = require('loadtest'),
    expect = require('chai').expect,
    credentials = require('../../src/app/configuration');

suite('Stress tests', function() {
  test('Homepage should handle 500 requests in a second', function(done) {
    var options = {
      url: 'http://localhost:' + credentials.server.port,
      concurrency: 4,
      maxRequests: 400
    };

    loadtest.loadTest(options, function(err, result) {
      expect(!err);
      expect(result.totalTimeSeconds < 1);
      done();
    });
  });
});
