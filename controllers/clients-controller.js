var utils = require('../models/utilities.js'),
    ClientManagementService = require('../services/client-management-service.js'),
    UserManagementService = require('../services/user-management-service.js'),
    RoleManagementService = require('../services/role-management-service.js'),
    basicAuth = require('basic-auth');

/**
 * @api {get} /clients Get all available clients according to these rules:
 *                     - If logged in user is admin, then all users belonging to his/her company are returned.
 *                     - If logged in user is not admin, then error code 403 is returned.
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
exports.getAllClients = function (req, res) {
  "use strict";
  var credentials = basicAuth(req);
  if (credentials === undefined || !credentials) return res.sendStatus(403);
  var client = null;
  console.info('getAlLClients()');
  UserManagementService.getUser(credentials).then(user => {
    console.info('user: ' + JSON.stringify(user));
    if (!user || user === undefined || !user.role || user.role === undefined) {
      console.error('403 - Invalid login credentials');
      return res.sendStatus(403);
    }
    client = user.client;
    return RoleManagementService.getRole(user.role);
  })
  .then(role => {
    console.info('in controller role: ' + JSON.stringify(role));
    if (!role || role === undefined || role.name !== 'admin') {
      console.error('403 - Invalid role sent in credentials.');
      return res.sendStatus(403);
    }
    return ClientManagementService.getClient(client, role.uuid, false);
  })
  .then(client => {
    console.log('logged in client: ' + JSON.stringify(client));
    return ClientManagementService.getAllClientsByCorporate(client.corporateName);
  })
  .then(context => {
    if (!context) return res.status('200').send('No clients found in DB...');
    return res.status('200').send(context);
  })
  .catch(err => {
    console.error('error: ' + err.stack);
  });
};

/**
 * @api {get} /clients/:uuid Get client by given uuid
 * @apiName getClient
 * @apiGroup Client
 *
 * @apiParam None
 *
 * @apiSuccess (200) {Client[]} Clients JSON array of 1 client having given uuid.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
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
exports.getClient = function (req, res) {
  "use strict";
  var uuid = req.params.uuid;
  var promise = ClientManagementService.getClient(uuid);
  promise
  .then(client => {
    if (!client) return res.status('200').send('No clients found in DB...');
    console.info('client received: ' + JSON.stringify(client));
    return res.status('200').send(client);
  })
  .catch(err => {
    if (err) return res.status('500').send('error encountered while reading client from DB' + err.stack);
  });
};

/**
 * @api {post} /clients Add a new client
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
exports.addClient = function (req, res) {
  console.info('request body: ' + JSON.stringify(req.body));
  // Validate that the request body is present
  if (!req || !req.body) {
    console.error('invalid request object');
    return res.status(400).send('Bad Request');
  }

  // copy everything from request body into a DTO object
  var clientDTO = {
    uuid: utils.getUuid(),
    timestamp: utils.getTimestamp(),
    corporateName: req.body.corporateName,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    type: req.body.type,
    role: req.body.role,
    addresses: [],
    emails: [],
    contactNumbers: [],
  };

  req.body.addresses.forEach(function(address) {
    var a = address;
    clientDTO.addresses.push(address);
  });

  req.body.emails.forEach(function(email) {
    clientDTO.emails.push(email);
  });

  req.body.contactNumbers.forEach(function(contactNumber) {
    clientDTO.contactNumbers.push(contactNumber);
  });

  // Pass the DTO to client management service to save
  ClientManagementService.addClient(clientDTO, function (err) {
    if (err === 500) {
      return res.status('500').send('error encountered while adding client to DB. Intrenal server error.');
    } else if (err === 400) {
      console.error('error occured: ');
      return res.status('400').send('error encountered while adding client to DB. Please check your JSON.');
    } else {
      console.log('DB save over...: ');
      return res.status('201').send('client was saved into DB ');
    }
  });
};
