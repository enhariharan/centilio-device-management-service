var assert = require('chai').assert;
var ClientManagementService = require('../../services/client-management-service.js');
var Client = require('../../models/client-model.js').Client;
var User = require('../../models/user-model.js').User;
var Utils = require('../../models/utilities.js');
var mongoose = require('mongoose');
var restler = require('restler');
var credentials = require('../../credentials.js');
var opts = {
  server: {
    secketOptions: { keepAlive: 1 }
  }
};
mongoose.connect(credentials.mongo.development.connectionString, opts);

var baseurl = 'http://localhost:4123';
var loginurl = baseurl + '/login';

suite('login controller integration tests', function() {
  test('getUser with proper credentials must return a client', (done) => {
    var options = {
      method: 'post',
      username: 'userClient1Corp1',
      password: 'password',
    };
    restler.get(loginurl, options)
    .on('success', client => {
      assert(client !== null);
      assert(client.corporateName === 'corporation 1');
      assert(client.firstName === 'Ashok');
      assert(client.lastName === 'Kumar');
      assert(client.middleName === 'M');
      assert(client.type === 'corporate');
      assert(client.addresses[0].client === client.uuid);
      assert(client.addresses[0].line1 === '123, HiTec City');
      assert(client.addresses[0].line2 === '');
      assert(client.addresses[0].city === 'Hyderabad');
      assert(client.addresses[0].state === 'Telangana');
      assert(client.addresses[0].countryCode === 'IN');
      assert(client.addresses[0].zipCode === '500081');
      assert(client.addresses[0].latitude === '17.447162');
      assert(client.addresses[0].longitude === '78.376808');
      assert(client.addresses[0].type === 'work');
      assert(client.addresses[0].status === 'active');
      assert(client.emails[0].client === client.uuid);
      assert(client.emails[0].email === 'client1@corp1.com');
      assert(client.emails[0].type === 'work');
      assert(client.emails[1].client === client.uuid);
      assert(client.emails[1].email === 'client.1@corp1.com');
      assert(client.emails[1].type === 'work');
      assert(client.emails[2].client === client.uuid);
      assert(client.emails[2].email === 'client.1@gmail.com');
      assert(client.emails[2].type === 'personal');
      assert(client.contactNumbers[0].client === client.uuid);
      assert(client.contactNumbers[0].number === '+911234567890');
      assert(client.contactNumbers[0].type === 'work');
      done();
    });
  });
});

// mongoose.connection.close();
