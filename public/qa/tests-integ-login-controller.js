var assert = require('chai').assert,
    mongoose = require('mongoose'),
    restler = require('restler'),

    ClientManagementService = require('../../services/client-management-service.js'),
    Client = require('../../models/client-model.js').Client,
    User = require('../../models/user-model.js').User,

    credentials = require('../../credentials.js'),
    opts = { server: { socketOptions: { keepAlive: 1 } } },
    dbConnection = mongoose.createConnection(credentials.mongo.test.connectionString, opts),

    baseurl = 'http://localhost:' + credentials.server.port,
    loginurl = baseurl + '/login';

suite('login router integration tests - ', function() {

  test('addUser with proper credentials must add a new client', (done) => {
    var testUserName = 'newUser1',
        testPassword = 'password12';

    restler.post(loginurl, { method: 'post', username: testUserName, password:  testPassword })
    .on('complete', (result, res) => {
      console.log('result is ' + JSON.stringify(result));
      assert(result !== null && result !== '' && result !== undefined);
      assert(result === 'Created');
      done();
    })
    .on('fail', (data, res) => {
      console.log('data: ' + JSON.stringify(data));
      assert(false);
      done();
    })
  });

  test('addUser with existing username must return error code 400', (done) => {
    var testUserName = 'newUser1';
    var testPassword = 'password12';

    // create a new user with username as in testUserNameand verify that it was created properly
    restler.post(loginurl, { method: 'post', username: testUserName, password:  testPassword })
    .on('success', responseStatus => {
      assert(responseStatus !== null && responseStatus !== '' && responseStatus !== undefined);
      assert(responseStatus === 'Created');
    });

    // now try to create a new user with the same user name
    restler.post(loginurl, { method: 'post', username: testUserName, password:  testPassword })
    .on('success', responseStatus => {
      console.log('responseStatus on success: ' + responseStatus);
      assert(false);
    })
    .on('error', responseStatus => {
      console.log('responseStatus on error: ' + responseStatus);
      assert(responseStatus === 400);
    });

    done();
  });

  test('getUser with proper credentials must return a client', (done) => {
    restler.get(loginurl, { method: 'post', username: 'userClient1Corp1', password: 'password' })
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
      assert(client.devices[0].client === client.uuid);
      assert(client.devices[0].name === 'device 1');
      assert(client.devices[0].status === 'online');
      assert(client.devices[1].client === client.uuid);
      assert(client.devices[1].name === 'device 2');
      assert(client.devices[1].status === 'online');
      done();
    });
  });
});

dbConnection.close();
