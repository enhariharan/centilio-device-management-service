var User = require('../models/user-model.js').User,
    Utilities = require('../models/utilities.js');

exports.getUser = function(credentials) {
  return new Promise(
    function(resolve, reject) {
      User.find({username: credentials.name}).exec()
      .then(
        users => {
          if (users !== null && users.length !== 1) reject(500);
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

exports.addUser = function(credentials) {
  return new Promise(
    function(resolve, reject) {
      var userToSave = new User({
        uuid: Utilities.getUuid(),
        timestamp: Utilities.getTimestamp(),
        username: credentials.name,
        password: credentials.pass,
        status: 'registered',
      });

      User.find({username: credentials.name}).exec()
      .then(
        user => {
          console.info('\nusers found: ' + JSON.stringify(user));
          if (user === null || user.length === 0) return userToSave.save();
          else reject(400);
        })
        .then(user => {
          console.info('\nusers saved: ' + JSON.stringify(user));
          resolve(user);
        })
        .catch(err => {
          console.info('\nerror: ' + JSON.stringify(err) + err.stack);
        });
      }
    );
  };
