var BasicAuth = require('basic-auth');

exports.isValidCredentials = (req) => {
  var credentials = BasicAuth(req);
  if (credentials === undefined || !credentials) return false;
  User.findOne({username: credentials.name}).then(user => {
    if (!user || user === undefined
       || credentials.name.toLowerCase().localeCompare(user.username.toLowerCase())
       || credentials.pass.localeCompare(user.password)) return false;
  });
  return true;
};
