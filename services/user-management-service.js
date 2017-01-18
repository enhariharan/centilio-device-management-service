var User = require('../models/user-model.js').User,
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
      var userToSave = new User({
        uuid: Utilities.getUuid(),
        timestamp: Utilities.getTimestamp(),
        username: newUserDetails.email,
        password: newUserDetails.password,
        role: newUserDetails.role,
        status: 'new user',
        profilePicPath: '',
        client: ''
      });

      User.find({username: credentials.name}).exec()
      .then(
        user => {
          if (user === undefined || user === null || user.length === 0) {
            console.error('Incorrect admin credentials sent while adding new user');
            reject(400);
          }
          return userToSave.save();
        })
        .then(user => {
          resolve(user);
        })
        .catch(err => {
          console.info('\nerror: ' + JSON.stringify(err) + err.stack);
        });
      }
    );
  };
