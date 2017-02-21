var BasicAuth = require('basic-auth'),
    Validator = require('../security/validator.js'),
    InitService = require('../services/initializer-service.js');

exports.initializeDB = (req, res) => {
  "use strict";

  Validator.isValidCredentialsForInitialize(req)
  .then(result => { return InitService.initializeDB(); })
  .then(result => {
    if (!result || result !== true || result === undefined) throw(500);
    return res.sendStatus(200);
  })
  .catch(err => {
    console.error('err occurred while initializing DB: ' + JSON.stringify(err) + ' ' + err.stack );
    return res.sendStatus(err);
  });
};

exports.initializeInstance = (req, res) => {
  "use strict";

  Validator.isValidCredentialsForInitialize(req)
  .then(result => { return InitService.initializeInstance(req.body); })
  .then(savedClient => {
    if (!savedClient || savedClient === undefined) throw(500);
    return res.status(200).send(savedClient);
  })
  .catch(err => {
    console.error('err occurred while initializing instance: ' + JSON.stringify(err) + ' ' + err.stack );
    return res.sendStatus(err);
  });
};
