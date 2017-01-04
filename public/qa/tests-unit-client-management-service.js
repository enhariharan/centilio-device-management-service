var assert = require('chai').assert;
var ClientManagementService = require('../../services/client-management-service.js');
var Client = require('../../models/client-model.js');
var Utils = require('../../models/utilities.js');
var mongoose = require('mongoose');
var credentials = require('../../credentials.js');
var opts = {
  server: {
    secketOptions: { keepAlive: 1 }
  }
};
mongoose.connect(credentials.mongo.development.connectionString, opts);

suite('ClientManagementService Unit tests', function() {
  test('well formed Client must be saved successfully', function(done) {
    var client = {
      uuid: Utils.getUuid(),
      timestamp: Utils.getTimestamp(),
      name: 'AB Inc',
      type: 'corporate'
    };
    ClientManagementService.addClient(client, function(err) {
      assert(err === null);
    });
    done();
  });
});
