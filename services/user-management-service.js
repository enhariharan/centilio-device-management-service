var User = require('../models/user-model.js').User,
    Client = require('../models/client-model.js').Client,
    Email = require('../models/client-model.js').Email,
    Utilities = require('../models/utilities.js');

exports.getUser = function(credentials) {
  return new Promise(
    function(resolve, reject) {
      User.find({username: credentials.name}).exec()
      .then(
        users => {
          if (users !== null && users.length === 0) reject(400);
          if (users !== null && users.length !== 1) reject(500);
          if (users[0].password !== credentials.pass) reject(400);
          var userDTO = {
            username: users[0].username,
            gender: users[0].gender,
            profilePicPath: users[0].profilePicPath,
            client: users[0].client,
            role: users[0].role
          };
          resolve(userDTO);
        }
      ).catch(err => { reject(err); });
    }
  );
};

exports.addUser = function(credentials, newUserDetails) {
  return new Promise(
    (resolve, reject) => {
      var clientToSave = null;
      var userToSave = null;
      var emailToSave = null;

      console.log('clientToSave: ' + JSON.stringify(clientToSave));
      console.log('userToSave: ' + JSON.stringify(userToSave));
      console.log('emailToSave: ' + JSON.stringify(emailToSave));
      User.find({username: credentials.name}).exec()
      .then(
        users => {
          console.log('\n admin user: ' + JSON.stringify(users[0]));
          if (users === undefined || users === null || users.length === 0) {
            console.error('Incorrect admin credentials sent while adding new user');
            reject(400);
          }
          return Client.find({uuid: users[0].client}).exec();
      })
      .then(
        adminClients => {
          console.log('\n adminClient : ' + JSON.stringify(adminClients[0]));
          var clientToSave = new Client({
            uuid: Utilities.getUuid(),
            timestamp: Utilities.getTimestamp(),
            firstName: newUserDetails.firstName,
            lastName: newUserDetails.lastName,
            middleName: '',
            corporateName: adminClients[0].corporateName,
            type: 'corporate'
          });
          console.log('\n clientToSave : ' + JSON.stringify(clientToSave));
          return clientToSave.save();
      })
      .then(client => {
        console.info('saved client: ' + JSON.stringify(client));

        var userToSave = new User({
          uuid: Utilities.getUuid(),
          timestamp: Utilities.getTimestamp(),
          username: newUserDetails.email,
          password: newUserDetails.password,
          role: newUserDetails.role,
          status: 'new user',
          profilePicPath: '',
          client: client.uuid
        });

        return userToSave.save();
      })
      .then(user => {
        console.info('saved user: ' + JSON.stringify(user));

        var emailToSave = new Email({
          email: newUserDetails.email,
          type: 'primary',
          client: user.uuid
        });

        return emailToSave.save();
      })
      .then(email => {
        console.info('saved email: ' + JSON.stringify(email));
        resolve(newUserDetails);
      })
      .catch(err => {
        console.info('\nerror: ' + JSON.stringify(err) + err.stack);
      });
    });
  };
