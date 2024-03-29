var assert = require('chai').assert,
    mongoose = require('mongoose'),
    restler = require('restler'),
    CleanupDB = require('./cleanup-db'),
    SetupDB = require('./setup-db'),

    ClientManagementService = require('../../src/services/client-management-service.js'),
    Client = require('../../src/models/client-model.js').Client,
    User = require('../../src/models/user-model.js').User,

    credentials = require('../../src/app/configuration'),
    opts = { server: { socketOptions: { keepAlive: 1 } } },
    dbConnection = mongoose.createConnection(credentials.mongo.test.connectionString, opts),

    baseurl = 'http://localhost:' + credentials.server.port,
    loginurl = baseurl + '/login';

suite('login router integration tests - ', () => {

  setup(() => {
    CleanupDB.cleanupDB(dbConnection)
    .then(result => {
      console.info('\nDB cleanup done.');
      return SetupDB.setupDB(dbConnection);
    })
    .then(result => { console.info('\nDB setup done.'); })
    .catch(err => {console.log('\nsetup threw error ' + err.stack)});
  });

  teardown(() => { CleanupDB.cleanupDB(); });

  test('addUser with proper credentials must add a new client', (done) => {
    var adminUserName = 'userClient2Corp1',
        adminPassword = 'password12',
        newUser = {"firstName": "John", "lastName": "Woo", "email": "john.woo@centil.io", "password": "password", "role": "83356361-e0a4-4942-98b8-1a1c8ad4c943"};

    restler.postJson(baseurl+'/users', newUser, { method: 'post', username: adminUserName, password:  adminPassword })
    .on('complete', (result, res) => {
      assert(result !== null && result !== '' && result !== undefined);
      console.log(result);
      assert(result === 'Created');
      done();
    })
    .on('fail', (data, res) => {
      console.log('data: ' + JSON.stringify(data));
      assert(false);
      done();
    });
  });

  test('addUser with existing username must return error code 400', (done) => {
    var testUserName = 'newUser1';
    var testPassword = 'password12';

    // create a new user with username as in testUserNameand verify that it was created properly
    restler.postJson(loginurl, { method: 'post', username: testUserName, password:  testPassword })
    .on('success', responseStatus => {
      assert(responseStatus !== null && responseStatus !== '' && responseStatus !== undefined);
      assert(responseStatus === 'Created');
    });

    // now try to create a new user with the same user name
    restler.postJson(loginurl, { method: 'post', username: testUserName, password:  testPassword })
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

  // test('getUser with proper credentials must return a client', (done) => {
  //   restler.get(loginurl, { method: 'get', username: 'userClient1Corp1', password: 'password' })
  //   .on('success', client => {
  //     assert(client !== null);
  //     assert(client.corporateName === 'corporation 1');
  //     assert(client.firstName === 'Ashok');
  //     assert(client.lastName === 'Kumar');
  //     assert(client.middleName === 'M');
  //     assert(client.type === 'corporate');
  //     assert(client.addresses[0].client === client.uuid);
  //     assert(client.addresses[0].line1 === '123, HiTec City');
  //     assert(client.addresses[0].line2 === '');
  //     assert(client.addresses[0].city === 'Hyderabad');
  //     assert(client.addresses[0].state === 'Telangana');
  //     assert(client.addresses[0].countryCode === 'IN');
  //     assert(client.addresses[0].zipCode === '500081');
  //     assert(client.addresses[0].latitude === '17.447162');
  //     assert(client.addresses[0].longitude === '78.376808');
  //     assert(client.addresses[0].type === 'work');
  //     assert(client.addresses[0].status === 'active');
  //     assert(client.emails[0].client === client.uuid);
  //     assert(client.emails[0].email === 'client1corp1@snigdha.co.in');
  //     assert(client.emails[0].type === 'primary');
  //     assert(client.emails[1].client === client.uuid);
  //     assert(client.emails[1].email === 'client.1@corp1.com');
  //     assert(client.emails[1].type === 'work');
  //     assert(client.emails[2].client === client.uuid);
  //     assert(client.emails[2].email === 'client.1@gmail.com');
  //     assert(client.emails[2].type === 'personal');
  //     assert(client.contactNumbers[0].client === client.uuid);
  //     assert(client.contactNumbers[0].number === '+911234567890');
  //     assert(client.contactNumbers[0].type === 'work');
  //     assert(client.devices[0].client === client.uuid);
  //     assert(client.devices[0].name === 'device 1');
  //     assert(client.devices[0].status === 'online');
  //     assert(client.devices[1].client === client.uuid);
  //     assert(client.devices[1].name === 'device 2');
  //     assert(client.devices[1].status === 'online');
  //     done();
  //   });
  // });
});

dbConnection.close();
