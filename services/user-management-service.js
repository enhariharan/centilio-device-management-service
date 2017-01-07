var User = require('../models/user-model.js').User,
    Utilities = require('../models/utilities.js');

exports.getUser = function(credentials) {
  return new Promise(
    function(resolve, reject) {
      User.find({username: credentials.name}).exec()
      .then(
        users => {
          if (users !== null && users.length !== 1) reject(500);
          var userDTO = {};
          console.info('users: ' + JSON.stringify(users));
          console.info('userDTO: ' + JSON.stringify(userDTO));
          userDTO.username = users[0].username;
          userDTO.gender = users[0].gender;
          userDTO.profilePicPath = users[0].profilePicPath;
          userDTO.client = users[0].client;
          userDTO.role = users[0].role;
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
      var findUserQueryPromise = User.find({username: credentials.name}).exec();

      findUserQueryPromise.then(
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

      // User.find({username: credentials.name}).exec()
      // .then(
      //   users => {
      //     console.info('\nusers found: ' + JSON.stringify(users));
      //     if (users !== null && users.length !== 0){
      //       console.info('\nusers already exist: ' + JSON.stringify(users));
      //       reject(400);
      //     }
      //     return userToSave.save();
      //   })
      //   .then(user => {
      //     user.password = 'Not Displayed';
      //     console.info('\nadded user: ' + JSON.stringify(user));
      //     resolve(user);
      //   })
      //   .catch(err => {
      //     console.error('error while saving new user: ' + err.stack);
      //     reject(err);
      //   });
      }
    );
  };
