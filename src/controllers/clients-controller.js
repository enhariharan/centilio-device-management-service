var utils = require('../models/utilities'),
    ClientManagementService = require('../services/client-management-service'),
    UserManagementService = require('../services/user-management-service'),
    RoleManagementService = require('../services/role-management-service'),
    Validator = require('../security/validator'),
    BasicAuth = require('basic-auth');

/**
 * @api {get} /clients Get all available clients. Only admin role can access this URI.
 * @apiName getAllClients
 * @apiGroup Client
 *
 * @apiParam None
 *
 * @apiSuccess (200) {Client[]} clients Array of clients.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "clients": [
 *        {
 *          "uuid": "491eeac5-f7c5-4c08-a19a-0dc376098702",
 *          "timestamp": "2016-12-30T12:32:20.819Z",
 *          "name": "Ashok Kumar",
 *          "type": "retail"
 *          "addresses" :
 *            [
 *              {
 *                "line1" : "123, ABC Road",
 *                "line2" : "DEF Blvd",
 *                "city" : "GHIJK City",
 *                "state" : "LM State",
 *                "countryCode" : "IN",
 *                "zipCode" : "NOPQRS",
 *                "latitude" : "100.01",
 *                "longitude" : "100.01",
 *                "type" : "work",
 *                "uuid" : "9eab071b-529a-4175-8033-7043a8fcc510",
 *                "timestamp" : ISODate("2016-12-31T06:34:50.615Z"),
 *                "status" : "active",
 *                "_id" : ObjectId("5867518afc5bcb32f456f9c5") *              },
 *              },
 *              {
 *                "line1" : "Address line 1",
 *                "line2" : "Address line 2",
 *                "city" : "City name",
 *                "state" : "State Code",
 *                "countryCode" : "country Code",
 *                "zipCode" : "ZiPCoDe",
 *                "latitude" : "100.01",
 *                "longitude" : "100.01",
 *                "type" : "home",
 *                "uuid" : "9eab071b-529a-4175-8033-7043a8fcc510",
 *                "timestamp" : ISODate("2016-12-31T06:34:50.615Z"),
 *                "status" : "active",
 *                "_id" : ObjectId("5867518afc5bcb32f456f9c5")
 *              },
 *            ]
 *        },
 *        {
 *          "uuid": "491eeac5-f7c5-4c08-a19a-0dc376098612",
 *          "timestamp": "2016-12-28T12:32:20.819Z",
 *          "name": "Centilio",
 *          "type": "corporate"
 *        },
 *      ]
 *    }
 */
exports.getAllClients = (req, res) => {
  "use strict";

  // Validate input and exit in case of an error right now
  Validator.isUserAdmin(req)
  .then(result => {
    if (!result) throw (403);
    return ClientManagementService.getClientByAuthCredentials(req);
  })
  .then(client => {
    if (!client || client === undefined) return res.sendStatus(403);
    return ClientManagementService.getAllClientsByCorporate(client.corporateName);
  })
  .then(context => {
    if (!context) return res.status('200').send('No clients found in DB...');
    return res.status('200').send(context);
  })
  .catch(err => {
    if (err === 403 || err === 400) return res.sendStatus(err);
    return res.sendStatus('500');
  });
};

/**
 * @api {get} /clients/:uuid Get client by given uuid. Admin can access any uuid. Users can access only
 * their details by providing their client uuid.
 * @apiName getClient
 * @apiGroup Client
 *
 * @apiParam None
 *
 * @apiSuccess (200) {Client[]} Clients JSON array of 1 client having given uuid.
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "clients": [
 *       {
 *         "uuid": "491eeac5-f7c5-4c08-a19a-0dc376098702",
 *         "timestamp": "2016-12-30T12:32:20.819Z",
 *         "name": "Ashok Kumar",
 *         "type": "retail"
 *         "addresses" :
 *           [
 *             {
 *               "line1" : "123, ABC Road",
 *               "line2" : "DEF Blvd",
 *               "city" : "GHIJK City",
 *               "state" : "LM State",
 *               "countryCode" : "IN",
 *               "zipCode" : "NOPQRS",
 *               "latitude" : "100.01",
 *               "longitude" : "100.01",
 *               "type" : "work",
 *               "uuid" : "9eab071b-529a-4175-8033-7043a8fcc510",
 *               "timestamp" : ISODate("2016-12-31T06:34:50.615Z"),
 *               "status" : "active",
 *               "_id" : ObjectId("5867518afc5bcb32f456f9c5") *              },
 *             },
 *             {
 *               "line1" : "Address line 1",
 *               "line2" : "Address line 2",
 *               "city" : "City name",
 *               "state" : "State Code",
 *               "countryCode" : "country Code",
 *               "zipCode" : "ZiPCoDe",
 *               "latitude" : "100.01",
 *               "longitude" : "100.01",
 *               "type" : "home",
 *               "uuid" : "9eab071b-529a-4175-8033-7043a8fcc510",
 *               "timestamp" : ISODate("2016-12-31T06:34:50.615Z"),
 *               "status" : "active",
 *               "_id" : ObjectId("5867518afc5bcb32f456f9c5")
 *             },
 *           ]
 *         {
 *           "uuid": "491eeac5-f7c5-4c08-a19a-0dc376098612",
 *           "timestamp": "2016-12-28T12:32:20.819Z",
 *           "name": "Centilio",
 *           "type": "corporate"
 *         },
 *       ]
 *     }
 */
exports.getClient = (req, res) => {
  "use strict";
  Validator.isAuthorizedForGetClientByUuid(req)
  .then(result => {
    if (!result) throw(403);
    return ClientManagementService.getClient(req.params.uuid);
  })
  .then(client => {
    if (!client || client === undefined) return res.status('200').send('No clients found in DB...');
    return res.status('200').send(client);
  })
  .catch(err => {
    if (err === false || err === 403) return res.sendStatus(403);
    if (err) return res.status('500').send('error encountered while reading client from DB' + err.stack);
  });
};

var _prepareToSave = (data) => {
  return new Promise(
    (resolve, reject) => {
      // copy everything from request body into a DTO object
      var clientDTO = {
        uuid: utils.getUuid(),
        timestamp: utils.getTimestamp(),
        corporateName: data.corporateName,
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName,
        primaryEmail: data.primaryEmail,
        type: data.type,
        role: data.role,
        addresses: [],
        emails: [],
        contactNumbers: [],
      };

      if (data.addresses && data.addresses !== undefined)
        data.addresses.forEach(a => { clientDTO.addresses.push(a);});

      if (data.emails && data.emails !== undefined)
        data.emails.forEach(e => { clientDTO.emails.push(e);});

      if (data.contactNumbers && data.contactNumbers !== undefined)
        data.contactNumbers.forEach(cn => {clientDTO.contactNumbers.push(cn);});

      resolve(clientDTO);
  });
};

/**
 * @api {post} /clients Add a new client. Only admin can access this URI.
 * @apiName addClient
 * @apiGroup Client
 *
 * @apiParam (client) {Client} client Give a client as JSON
 * @apiParamExample {json} Request-header "Content-Type: application/json" must be set.  Request-Example:
 *        {
 *          "corporateName": "AB Inc",
 *          "firstName" : "John",
 *          "lastName" : "Doe",
 *          "type": "corporate",
 *          "addresses": [{
 *            "line1": "123, ABC Road",
 *            "line2": "DEF Blvd",
 *            "city": "GHIJK City",
 *            "state": "LM State",
 *            "countryCode": "IN",
 *            "zipCode": "NOPQRS",
 *            "latitude": "100.01",
 *            "longitude": "100.01",
 *            "type": "work"
 *          }],
 *          "emails": [{
 *            "email": "ashok.kumar@centilio.com",
 *            "type": "work"
 *          }],
 *          "contactNumbers": [{
 *            "number": "+919972012345",
 *            "type": "work"
 *          }],
 *          "role" : "user"
 *        }
 *
 * @apiSuccess (201) {Client} client Created client is returned as JSON.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *
 * @apiError (400) {String} BadRequest Error code 400 is returned if the JSON format is incorrect.
 * @apiError (500) {String} InternalServerError Error code 500 is returned in case of some error in the server.
 */
exports.addClient = (req, res) => {
  Validator.isUserAdmin(req)
  .then(result => {
    console.log('\nValidator result is ' + JSON.stringify(result));
    if (!result || result === false) throw(403);
    if (!req || !req.body) throw(400);
    return _prepareToSave(req.body);
  })
  .then(clientDTO => { return ClientManagementService.addClient(clientDTO); })
  .then(client => {
    if (!client || client === undefined) throw(500);
    console.log('saved client: ' + JSON.stringify(client.firstName));
    return res.status('201').send(client);
  })
  .catch(err => {
    console.log('saving client threw err: ' + err.stack);
    if (err === false || err === 403) return res.sendStatus('403');
    if (err === 400) return res.sendStatus('400');
    return res.sendStatus('500');
  });
};
