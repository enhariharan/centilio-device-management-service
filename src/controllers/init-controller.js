var BasicAuth = require('basic-auth'),
    Validator = require('../security/validator'),
    Errros = require('../security/errors').errors,
    InitService = require('../services/initializer-service');

/**
 * @api {post} /instances Performs a factory reset of the database, this requires super admin privileges.
 * @apiName init
 * @apiGroup Instance
 *
 * @apiParam (user) {Credentials} credentials super admin credentials must be provided here
 * @apiParamExample {json} Request-header "Content-Type: application/json" must be set.
 *                  {json} Request-header Basic Authentication details must ne set. This should be changed to stateless JWT based token based authentication.
 *
 * @apiSuccess (201)
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 201 Created
 *
 */
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

/**
 * @api {post} /instances Create a new instance of the server for a new client
 * @apiName initializeInstance
 * @apiGroup Instance
 *
 * @apiParam (user) {Credentials} credentials super admin credentials must be provided here
 * @apiParamExample {json} Request-header "Content-Type: application/json" must be set.
 *                  {json} Request-header Basic Authentication details must ne set. This should be changed to stateless JWT based token based authentication.
 *                  {json} Request-body should send the new user name, passsword, role type in the following format.
 * {
 *   "firstname": "Hariharan",
 *   "lastname": "Narayanan",
 *   "email" : "enhariharan@gmail.com",
 *   "organisation" : "some org",
 *   "address" : {
 *     "line1" : "123, ABC Road",
 *     "line2" : "DEF Blvd",
 *     "city" : "GHIJK City",
 *     "state" : "LM State",
 *     "countryCode" : "IN",
 *     "zipCode" : "NOPQRS",
 *     "latitude" : "100.01",
 *     "longitude" : "100.01",
 *     "type" : "work",
 *     "status" : "active"
 *   }
 * }
 *
 * @apiSuccess (201) {Client} client A new instance is created, a client is created, a new organisation is created. The combined DTO object is returned.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 201 Created
 * [
 *   {
 *     "__v": 0,
 *     "client": "cb2234f1-74f7-4f73-81e7-732af113eace",
 *     "line1": "123, ABC Road",
 *     "line2": "DEF Blvd",
 *     "city": "GHIJK City",
 *     "state": "LM State",
 *     "countryCode": "IN",
 *     "type": "work",
 *     "_id": "58b8e1654e61292192fce88c"
 *   },
 *   {
 *     "__v": 0,
 *     "client": "cb2234f1-74f7-4f73-81e7-732af113eace",
 *     "email": "enhariharan@gmail.com",
 *     "type": "primary",
 *     "_id": "58b8e1654e61292192fce88d"
 *   },
 *   {
 *     "__v": 0,
 *     "uuid": "cb2234f1-74f7-4f73-81e7-732af113eace",
 *     "timestamp": "2017-03-03T03:22:13.144Z",
 *     "corporateName": "some org",
 *     "firstName": "Hariharan",
 *     "lastName": "Narayanan",
 *     "middleName": "",
 *     "primaryEmail": "enhariharan@gmail.com",
 *     "type": "active",
 *     "role": "3c31410e-bfa7-4fa1-95f6-91fd39eac4f0",
 *     "_id": "58b8e1654e61292192fce88b"
 *   }
 * ]
 *
 */
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
