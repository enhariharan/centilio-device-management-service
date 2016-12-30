var utils = require('../models/utilities.js');
var ClientManagementService = require('../services/client-management-service.js');

exports.getAllClients = function (req, res) {
  "use strict";

  ClientManagementService.getAllClients(function (err, context) {
    if (err) return res.status('500').send('error encountered while reading clients from DB');

    if (!context) return res.status('200').send('No clients found in DB...');

    return res.status('200').send(context);
  });
};

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
