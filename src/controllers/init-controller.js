var BasicAuth = require('basic-auth'),
    Validator = require('../security/validator.js'),
    InitService = require('../services/initializer-service.js');

exports.initialize = (req, res) => {
  "use strict";

  // Get the credentials
  var credentials = BasicAuth(req);  // TODO: Change this to JWT based stateless token based authentication

  Validator.isValidCredentialsForInitialize(req)
  .then(result => { return InitService.initialize(); })
  .then(result => {
    if (!result || result !== true || result === undefined) throw(500);
    return res.sendStatus(200);
  })
  .catch(err => {
    console.error('err occurred while initializing: ' + JSON.stringify(err) + ' ' + err.stack );
    return res.sendStatus(err);
  });
};
