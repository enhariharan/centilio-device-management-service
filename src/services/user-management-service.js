var User = require('../models/user-model').User,
    Client = require('../models/client-model').Client,
    Email = require('../models/client-model').Email,
    Errors = require('../security/errors').errors,
    Utilities = require('../models/utilities');

exports.getUserByCredentials = (credentials) => {
  return new Promise(
    function(resolve, reject) {
      User.findOne({username: credentials.name}).exec()
      .then(user => {
          if (!user || user == undefined) throw(Errors.invalidCredentials);
          var userDTO = {
            username: user.username,
            gender: user.gender,
            profilePicPath: user.profilePicPath,
            client: user.client,
            role: user.role
          };
          resolve(userDTO);
      })
      .catch(err => {
        if (err.code === undefined) reject({code: '500', reason: err});
        reject(err);
      });
  });
};

exports.getAllUsers = () => {
  return new Promise(
    function(resolve, reject) {
      User.find().exec()
      .then(users => { resolve(users); })
      .catch(err => {
        if (err.code === undefined) reject({code: '500', reason: err});
        reject(err);
      });
  });
};

exports.addUser = (credentials, newUserDetails) => {
  return new Promise(
    (resolve, reject) => {
      var clientToSave = null;
      var userToSave = null;
      var emailToSave = null;

      User.findOne({username: credentials.name}).exec()
      .then(user => {
        if (!user || user === undefined) throw(Errors.userWithGivenUsernameNotFound);
        return Client.findOne({uuid: user.client}).exec();
      })
      .then(adminClient => {
        var clientToSave = new Client({
          uuid: Utilities.getUuid(),
          timestamp: Utilities.getTimestamp(),
          firstName: newUserDetails.firstName,
          lastName: newUserDetails.lastName,
          middleName: '',
          corporateName: adminClient.corporateName,
          type: 'corporate',
          role: newUserDetails.role,
          primaryEmail: newUserDetails.email,
        });
        return clientToSave.save();
      })
      .then(savedClient => {
        var userToSave = new User({
          uuid: Utilities.getUuid(),
          timestamp: Utilities.getTimestamp(),
          username: newUserDetails.email,
          password: newUserDetails.password,
          role: newUserDetails.role,
          status: 'new user',
          profilePicPath: '',
          client: savedClient.uuid
        });
        return userToSave.save();
      })
      .then(savedUser => {
        var emailToSave = new Email({
          email: newUserDetails.email,
          type: 'primary',
          client: savedUser.uuid
        });
        return emailToSave.save();
      })
      .then(savedEmail => {
        resolve(newUserDetails);
      })
      .catch(err => {
        if (err.code === undefined) reject({code: '500', reason: err});
        reject(err);
      });
  });
};
