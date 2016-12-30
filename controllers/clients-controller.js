var utils = require('../models/utilities.js');
var ClientManagementService = require('../services/client-management-service.js');

/**
 * @api {get} /clients Get all available clients
 * @apiName getAllClients
 * @apiGroup Client
 *
 * @apiParam None
 *
 * @apiSuccess (200) {Client[]} devices Array of clients.
 */
exports.getAllClients = function (req, res) {
  "use strict";

  ClientManagementService.getAllClients(function (err, context) {
    if (err) return res.status('500').send('error encountered while reading clients from DB');

    if (!context) return res.status('200').send('No clients found in DB...');

    return res.status('200').send(context);
  });
};

/**
 * @api {post} /clients Add a new client
 * @apiName addClient
 * @apiGroup Client
 *
 * @apiParam (client) {Client} Give a client as JSON
 *
 * @apiSuccess (201) {Client} Created clients is returned as JSON.
 *
 * @apiError (400) {String} BadRequest Error code 400 is returned if the JSON format is incorrect.
 * @apiError (500) {String} InternalServerError Error code 500 is returned in case of osme error in the server.
 */
exports.addClient = function (req, res) {
  if (!req || !req.body) {
    console.error('invalid request object');
    return res.status(400).send('Bad Request');
  }

  var client = {
    uuid: utils.getUuid(),
    timestamp: utils.getTimestamp(),
    name: req.body.name,
    type: req.body.type,
  };

  ClientManagementService.addClient(client, function (err) {
    if (err) return res.status('500').send('error encountered while adding client to DB');
    return res.status('201').send(client);
  });
};
