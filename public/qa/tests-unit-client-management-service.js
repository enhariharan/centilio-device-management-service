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
  test('at least one address should be provided for a new Client to be saved successfully', function(done) {
    var client = {
      uuid: Utils.getUuid(),
      timestamp: Utils.getTimestamp(),
      name: 'AB Inc',
      type: 'corporate',
      addresses: []
    };

    ClientManagementService.addClient(client, function(err) {
      assert(err === 1);
    });
    done();
  });

  test('well formed Client must be saved successfully', function(done) {
    var client = {
      uuid: Utils.getUuid(),
      timestamp: Utils.getTimestamp(),
      name: 'AB Inc',
      type: 'corporate',
      addresses: [],
      emails: [],
      contactNumbers: []
    };
    var address =  {
      line1 : "123, ABC Road",
      line2: "DEF Blvd",
      city: "GHIJK City",
      state: "LM State",
      countryCode: "IN",
      zipCode: "NOPQRS",
      latitude: "100.01",
      longitude: "100.01",
      type: "work"
    };
    var email = {
      email: "abc@gmail.com",
      type: "personal"
    };
    var contactNumber = {
      number: "+919972002321"
    };
    client.addresses.push(address);
    client.emails.push(email);
    client.contactNumbers.push(contactNumber);

    ClientManagementService.addClient(client, function(err) {
      console.log(err);
      assert(err === null);
    });
    done();
  });
});