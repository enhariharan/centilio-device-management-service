var utils = require('../models/utilities.js'),
    DeviceManagementService = require('../services/device-management-service.js'),
    DeviceReadingManagementService = require('../services/device-reading-management-service.js');

/**
 * @api {get} /devices Get all available devices
 * @apiName getAllDevices
 * @apiGroup Device
 *
 * @apiParam None
 *
 * @apiSuccess (200) {Device[]} devices Array of devices.
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "devices": [{
 *       "uuid":"0123456789012345678901234567890123456789012345678901234567890123",
 *       "timestamp":"2016-12-30T11:52:28.637Z",
 *       "name":"Device 01",
 *       "latitude":"100.001",
 *       "longitude":"100.001",
 *       "deviceType":"5612d680-e008-4482-97e2-0391ce5d3994",
 *       "client": "b42f0bad-5a1d-485d-a0f2-308b8f53aed0"
 *       "status":"new"
 *     },
 *     {
 *       "uuid":"0123456789012345678901234567890123456789012345678901234567890124",
 *       "timestamp":"2016-12-28T11:52:28.637Z",
 *       "name":"Device 02",
 *       "latitude":"100.001",
 *       "longitude":"100.001",
 *       "deviceType":"5612d680-e008-4482-97e2-0391ce5d3994",
 *       "client": "b42f0bad-5a1d-485d-a0f2-308b8f53aed0"
 *       "status":"new"
 *     }]
 *   }
 */
 exports.getAllDevices = function (req, res) {
  "use strict";

  DeviceManagementService.getAllDevices(function (err, context) {
    if (err) return res.status(500).send('error encountered while reading devices from DB');

    if (!context) return res.status(200).send('No devices found in DB...');

    console.info('\ncontext: ' + JSON.stringify(context));
    return res.status(200).send(context);
  });
};

/**
 * @api {get} /devices/:uuid Get device by given uuid
 * @apiName getDevice
 * @apiGroup Device
 *
 * @apiParam None
 *
 * @apiSuccess (200) {Device} Device JSON having given uuid.
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "devices": [{
 *       "uuid":"0123456789012345678901234567890123456789012345678901234567890123",
 *       "timestamp":"2016-12-30T11:52:28.637Z",
 *       "name":"Device 01",
 *       "latitude":"100.001",
 *       "longitude":"100.001",
 *       "status":"new"
 *       "deviceType":"5612d680-e008-4482-97e2-0391ce5d3994",
 *       "client": "b42f0bad-5a1d-485d-a0f2-308b8f53aed0"
 *     }]
 *   }
 */
exports.getDevice = function (req, res) {
  "use strict";
  var uuid = req.params.uuid;
  DeviceManagementService.getDevice(uuid, function (err, context) {
    if (err) return res.status('500').send('error encountered while reading device from DB');

    if (!context) return res.status('400').send('No such device found in DB...');

    return res.status('200').send(context);
  });
};

/**
 * @api {get} /devices/:uuid/deviceReadings Get device readings by given device uuid
 * @apiName getDeviceReadingsByDeviceUuid
 * @apiGroup Device
 *
 * @apiParam None
 *
 * @apiSuccess (200) {Device} Device readings array as JSON.
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "deviceReadings": [{
 *       "uuid": "f982cea9-d271-445d-a937-6a5dafef6d29",
 *       "timestamp": "2017-01-18T07:14:34.472Z",
 *       "device": "20e7edea-0db9-4595-844f-c42b1b6e3951",
 *       "readings": [{
 *           "type": "latitude",
 *           "value": "100.01",
 *           "_id": "587f15da8636f73e30eff809"
 *         }, {
 *           "type": "longitude",
 *           "value": "100.001",
 *           "_id": "587f15da8636f73e30eff808"
 *         }, {
 *           "type": "charging status",
 *           "value": "charging",
 *           "_id": "587f15da8636f73e30eff807"
 *         }, {
 *           "type": "current charge",
 *           "value": "80",
 *           "_id": "587f15da8636f73e30eff806"
 *         }]
 *     },
 *     ...
 *     ...
 *  ]}
 */
exports.getDeviceReadingsByDeviceUuid = function (req, res) {
  "use strict";
  var uuid = req.params.uuid;
  DeviceReadingManagementService.getDeviceReadingsByDeviceUuid(uuid, function (err, context) {
    if (err) return res.status('500').send('error encountered while reading device readings for device ' + uuid);

    if (!context) return res.status('400').send('No such device found in DB...');

    return res.status('200').send(context);
  });
};

/**
 * @api {post} /devices Add a new device
 * @apiName addDevice
 * @apiGroup Device
 *
 * @apiParam (device) {json} Give a device as JSON.  UUID and timestamp are automatically generated.
 * @apiParamExample {json} Request-header "Content-Type: application/json" must be set.  Request-Example:
 *   {
 *     "name":"Device 01",
 *     "latitude":"100.001",
 *     "longitude":"100.001",
 *     "status":"new",
 *     "deviceType":"5612d680-e008-4482-97e2-0391ce5d3994",
 *     "client": "b42f0bad-5a1d-485d-a0f2-308b8f53aed0"
 *   },
 *
 * @apiSuccess (201) {Device} Created devices is returned as JSON.
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 201 Created
 *   {
 *     "uuid": "22e0805a-7002-4ae7-be1e-4877dd59fc04",
 *     "timestamp": 1483155714863,
 *     "name": "device 100",
 *     "latitude": "103.001",
 *     "longitude": "103.001",
 *     "deviceType":"5612d680-e008-4482-97e2-0391ce5d3994",
 *     "client": "b42f0bad-5a1d-485d-a0f2-308b8f53aed0"
 *     "status": "new"
 *   }
 *
 * @apiError (400) {String} BadRequest Error code 400 is returned if the JSON format is incorrect.
 * @apiError (500) {String} InternalServerError Error code 500 is returned in case of some error in the server.
 */
exports.addDevice = function (req, res) {
  console.info('req.body: ' + JSON.stringify(req.body));
  if (!req || !req.body) {
    console.error('invalid request object');
    return res.status(400).send('Bad Request');
  }

  var device = {
    uuid: utils.getUuid(),
    timestamp: utils.getTimestamp(),
    deviceId: req.body.deviceId,
    name: req.body.name,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    status: req.body.status,
    deviceType: req.body.deviceType,
    client: req.body.client
  };
  console.info('device: ' + JSON.stringify(device));

  DeviceManagementService.addDevice(device, function (err) {
    if (err === 400) return res.status('400').send('error encountered while adding device to DB.  Please check your JSON.');
    if (err)  return res.status('500').send('error encountered while adding device to DB.');

    return res.status('201').send(device);
  });
};
