var utils = require('../models/utilities.js');
var DeviceManagementService = require('../services/device-management-service.js');

exports.getAllDevices = function (req, res) {
  "use strict";

  DeviceManagementService.getAllDevices(function (err, context) {
    if (err) return res.status('500').send('error encountered while reading devices from DB');

    if (!context) return res.status('200').send('No devices found in DB...');

    return res.status('200').send(context);
  });
};

exports.addDevice = function (req, res) {
  if (!req || !req.body) {
    console.error('invalid request object');
    return res.status(400).send('Bad Request');
  }

  var device = {
    uuid: utils.getUuid(),
    timestamp: utils.getTimestamp(),
    name: req.body.name,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    status: req.body.status
  };

  DeviceManagementService.addDevice(device, function (err) {
    if (err) return res.status('500').send('error encountered while adding device to DB');
    return res.status('201').send(device);
  });
};
