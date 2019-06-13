var assert = require('chai').assert;
var ClientManagementService = require('../../src/services/client-management-service.js');
var Client = require('../../src/models/client-model.js').Client;
var Utils = require('../../src/models/utilities.js');
var mongoose = require('mongoose');
var credentials = require('../../src/app/configuration');
var opts = {
  server: {
    socketOptions: { keepAlive: 1 }
  }
};

var dbConnection = mongoose.createConnection(credentials.getDbConnection('test'), opts);

suite('ClientManagementService Unit tests', () => {
  test('at least one address should be provided for a new Client to be saved successfully', (done) => {
    var client = {
      uuid: Utils.getUuid(),
      timestamp: Utils.getTimestamp(),
      corporateName: 'WorldRule Inc',
      firstName: 'Jane',
      lastName: 'Doe',
      type: 'corporate',
      role: 'user',
      primaryEmail: 'firname.lastname@company.com',
      addresses: []
    };

    ClientManagementService.addClient(client, (err) => { assert(err === 400); });
    done();
  });

  test('well formed Client must be saved successfully', (done) => {
    var client = {
      uuid: Utils.getUuid(),
      timestamp: Utils.getTimestamp(),
      corporateName: 'WorldRule Inc',
      firstName: 'Jane',
      lastName: 'Doe',
      type: 'corporate',
      role: 'user',
      primaryEmail: 'firname.lastname@company.com',
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

    ClientManagementService.addClient(client, (err) => {
      console.log(err);
      assert(err === null);
    });
    done();
  });
});

dbConnection.close();
