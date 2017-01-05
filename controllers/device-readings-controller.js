var utils = require('../models/utilities.js');
var DeviceReadingManagementService = require('../services/device-reading-management-service.js');

/**
 * @api {get} /deviceReadings Get all available device readings
 * @apiName getAllDeviceReadings
 * @apiGroup DeviceReading
 *
 * @apiParam None
 *
 * @apiSuccess (200) {DeviceReadings[]} deviceReadings Array of device readings.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "deviceReadings": [
 *         {
 *           "uuid": "caf95dc0-3a6c-44e1-9fee-545f22b43b5c",
 *           "timestamp": "2017-01-05T12:47:08.240Z",
 *           "readings": [
 *             {
 *               "type": "latitude",
 *               "value": "100.01",
 *               "_id": "586e404cc3bbdf51608a5320"
 *             },
 *             {
 *               "type": "longitude",
 *               "value": "100.01",
 *               "_id": "586e404cc3bbdf51608a531f"
 *             }
 *           ]
 *         }
 *       ]
 *     }
 */
 exports.getAllDeviceReadings = function (req, res) {
  "use strict";

  DeviceReadingManagementService.getAllDeviceReadings(function (err, context) {
    if (err) return res.status('500').send('error encountered while reading device readings from DB');

    if (!context) return res.status('200').send('No device readings found in DB...');

    return res.status('200').send(context);
  });
};

/**
 * @api {get} /deviceReadings/:uuid Get client by given uuid
 * @apiName getDeviceReading
 * @apiGroup DeviceReading
 *
 * @apiParam None
 *
 * @apiSuccess (200) {DeviceReading} DeviceReading JSON having given uuid.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "deviceReadings": [
 *         {
 *           "uuid": "caf95dc0-3a6c-44e1-9fee-545f22b43b5c",
 *           "timestamp": "2017-01-05T12:47:08.240Z",
 *           "readings": [
 *             {
 *               "type": "latitude",
 *               "value": "100.01",
 *               "_id": "586e404cc3bbdf51608a5320"
 *             },
 *             {
 *               "type": "longitude",
 *               "value": "100.01",
 *               "_id": "586e404cc3bbdf51608a531f"
 *             }
 *           ]
 *         }
 *       ]
 *     }
 */
exports.getDeviceReading = function (req, res) {
  "use strict";
  var uuid = req.params.uuid;
  DeviceReadingManagementService.getDeviceReading(uuid, function (err, context) {
    if (err) return res.status('500').send('error encountered while reading device reading from DB');

    if (!context) return res.status('400').send('No such device reading found in DB...');

    return res.status('200').send(context);
  });
};

/**
 * @api {post} /deviceReadings Add a new device
 * @apiName addDeviceReading
 * @apiGroup DeviceReading
 *
 * @apiParam (deviceReading) {json} Give a device reading as JSON.  UUID and timestamp are automatically generated.
 * @apiParamExample {json} Request-header "Content-Type: application/json" must be set.  Request-Example:
 *       {
 *         "uuid": "caf95dc0-3a6c-44e1-9fee-545f22b43b5c",
 *         "timestamp": 1483620428240,
 *         "readings":
 *         [
 *           {
 *             "type": "latitude",
 *             "value": "100.01"
 *           },
 *           {
 *             "type": "longitude",
 *             "value": "100.01"
 *           }
 *         ]
 *       }
 *
 * @apiSuccess (201) {DeviceReading} Created deviceReading is returned as JSON.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "uuid": "caf95dc0-3a6c-44e1-9fee-545f22b43b5c",
 *       "timestamp": 1483620428240,
 *       "readings":
 *         [
 *           {
 *             "type": "latitude",
 *             "value": "100.01"
 *           },
 *           {
 *             "type": "longitude",
 *             "value": "100.01"
 *           }
 *         ]
 *     }
 *
 * @apiError (400) {String} BadRequest Error code 400 is returned if the JSON format is incorrect.
 * @apiError (500) {String} InternalServerError Error code 500 is returned in case of some error in the server.
 */
exports.addDeviceReading = function (req, res) {
  console.info('req.body: ' + JSON.stringify(req.body));
  if (!req || !req.body) {
    console.error('invalid request object');
    return res.status(400).send('Bad Request');
  }

  var deviceReading = {
    uuid: utils.getUuid(),
    timestamp: utils.getTimestamp(),
    readings: [],
  };
  req.body.readings.forEach(function(reading) {
    deviceReading.readings.push(reading);
  });
  console.info('deviceReading: ' + JSON.stringify(deviceReading));

  DeviceReadingManagementService.addDeviceReading(deviceReading, function (err) {
    if (err === 400) return res.status('400').send('error encountered while adding device reading to DB.  Please check your JSON.');
    if (err)  return res.status('500').send('error encountered while adding device reading to DB.');

    return res.status('201').send(deviceReading);
  });
};
