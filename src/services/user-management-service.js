var User = require('../models/user-model').User,
    Client = require('../models/client-model').Client,
    Email = require('../models/client-model').Email,
    Utilities = require('../models/utilities');

exports.getUserByCredentials = (credentials) => {
  return new Promise(
    function(resolve, reject) {
      User.findOne({username: credentials.name}).exec()
      .then(user => {
          if (user !== null && user.length === 0) reject(400);
          var userDTO = {
            username: user.username,
            gender: user.gender,
            profilePicPath: user.profilePicPath,
            client: user.client,
            role: user.role
          };
          resolve(userDTO);
      })
      .catch(err => { reject(err); });
  });
};

exports.addUser = function(credentials, newUserDetails) {
  return new Promise(
    (resolve, reject) => {
      var clientToSave = null;
      var userToSave = null;
      var emailToSave = null;

      User.find({username: credentials.name}).exec()
      .then(
        users => {
          if (users === undefined || users === null || users.length === 0) {
            reject(400);
          }
          return Client.find({uuid: users[0].client}).exec();
      })
      .then(
        adminClients => {
          var clientToSave = new Client({
            uuid: Utilities.getUuid(),
            timestamp: Utilities.getTimestamp(),
            firstName: newUserDetails.firstName,
            lastName: newUserDetails.lastName,
            middleName: '',
            corporateName: adminClients[0].corporateName,
            type: 'corporate',
            role: newUserDetails.role,
            primaryEmail: newUserDetails.email,
          });
          return clientToSave.save();
      })
      .then(client => {
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
        var emailToSave = new Email({
          email: newUserDetails.email,
          type: 'primary',
          client: user.uuid
        });
        return emailToSave.save();
      })
      .then(email => {
        resolve(newUserDetails);
      })
      .catch(err => {
        console.info('\nerror: ' + JSON.stringify(err) + err.stack);
      });
  });
};
