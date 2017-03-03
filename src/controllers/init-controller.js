var BasicAuth = require('basic-auth'),
    Validator = require('../security/validator'),
    Errros = require('../security/errors').errors,
    InitService = require('../services/initializer-service');

exports.initializeDB = (req, res) => {
  "use strict";

  Validator.isValidCredentialsForSuperAdminActivity(req)
  .then(result => {
    if (!result || result === undefined) throw(Errors.invalidCredentials);
    return InitService.initializeDB();
  })
  .then(result => {
    console.info('initializeDB result: %s', JSON.stringify(result));
    if (!result || result !== true || result === undefined) throw(Errors.couldNotInitializeDb);
    return res.sendStatus(200);
  })
  .catch(err => {
    console.error('Err: %s', JSON.stringify(err));
    return res.status(err.code).send(err);
  });
};

exports.initializeInstance = (req, res) => {
  "use strict";

  Validator.isValidCredentialsForSuperAdminActivity(req)
  .then(result => {
    if (!result || result === undefined) throw(Errors.invalidCredentials);
    return InitService.initializeInstance(req.body);
  })
  .then(savedClient => {
    console.info('savedClient: %s', JSON.stringify(savedClient));
    if (!savedClient || savedClient === undefined) throw(Errors.couldNotInitializeInstance);
    return res.status(200).send(savedClient);
  })
  .catch(err => {
    console.error('Err: %s', JSON.stringify(err));
    return res.status(err.code).send(err);
  });
};
