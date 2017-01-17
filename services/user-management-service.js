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

exports.addUser = function(credentials, roleUuid) {
  return new Promise(
    function(resolve, reject) {
      var userToSave = new User({
        uuid: Utilities.getUuid(),
        timestamp: Utilities.getTimestamp(),
        username: credentials.name,
        password: credentials.pass,
        role: roleUuid,
        status: 'registered',
      });

      User.find({username: credentials.name}).exec()
      .then(
        user => {
          if (user === undefined || user === null || user.length === 0) return userToSave.save();
          else {
            console.info('\nuser ' + user +  ' already exists');
            reject(400);
          }
        })
        .then(user => {
          console.info('\nuser saved: ' + user);
          resolve(user);
        })
        .catch(err => {
          console.info('\nerror: ' + JSON.stringify(err) + err.stack);
        });
      }
    );
  };
