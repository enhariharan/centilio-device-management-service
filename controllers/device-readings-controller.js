var utils = require('../models/utilities.js');
var DeviceReadingManagementService = require('../services/device-reading-management-service.js');

/**
 * @api {get} /deviceReadings Get all available device readings
 * @apiName getAllDeviceReadings
 * @apiGroup Device Readings
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
 *           "serverTimestamp": "2017-01-05T14:17:14.968Z",
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
 * @api {get} /deviceReadings/:uuid Get device reading by given uuid
 * @apiName getDeviceReading
 * @apiGroup Device Readings
 *
 * @apiParam None
 *
 * @apiSuccess (200) {DeviceReading} deviceReading JSON having given uuid.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "deviceReadings": [
 *         {
 *         "uuid": "6a91cf1d-e241-48c7-955d-4cd470ec5afb",
 *         "timestamp": "2017-01-05T14:17:14.968Z",
 *         "serverTimestamp": "2017-01-05T14:17:14.968Z",
 *         "device": "0a1da6bc-eb49-4f31-9bb1-83ed46c1eb80",
 *         "readings": [
 *         {
 *           "type": "latitude",
 *           "value": "100.01",
 *           "_id": "586e556a0f758160e6df6fbf"
 *         },
 *         {
 *           "type": "longitude",
 *           "value": "100.01",
 *           "_id": "586e556a0f758160e6df6fbe"
 *         }
 *       ]
 *     },
 *     {
 *       "uuid": "047919ce-2d97-4ee3-ab55-80fb3ebd433a",
 *       "timestamp": "2017-01-05T14:34:29.561Z",
 *       "serverTimestamp": "2017-01-05T14:17:14.968Z",
 *       "device": "0a1da6bc-eb49-4f31-9bb1-83ed46c1eb80",
 *       "readings":
 *         [
 *           {
 *             "type": "latitude",
 *             "value": "100.01",
 *             "_id": "586e5975161aba63da03687c"
 *           },
 *           {
 *             "type": "longitude",
 *             "value": "100.01",
 *             "_id": "586e5975161aba63da03687b"
 *           },
 *           {
 *             "type": "charging status",
 *             "value": "discharging"
 *           },
 *           {
 *             "type": "current charge",
 *             "value": "85"
 *           }
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
 * @api {post} /deviceReadings Add a new device reading
 * @apiName addDeviceReading
 * @apiGroup Device Readings
 *
 * @apiParam (deviceReading) {json} deviceReading Give a device reading as JSON.  UUID and timestamp are automatically generated.
 * @apiParamExample {json} Request-header "Content-Type: application/json" must be set.  Request-Example:
 *     {
 *       "device":"0a1da6bc-eb49-4f31-9bb1-83ed46c1eb80",
 *       "timestamp": 1483625834968,
 *       "readings":
 *         [
 *           {
 *             "type": "latitude",
 *             "value": "100.01"
 *           },
 *           {
 *             "type": "longitude",
 *             "value": "100.01"
 *           },
 *           {
 *             "type": "charging status",
 *             "value": "discharging"
 *           },
 *           {
 *             "type": "current charge",
 *             "value": "85"
 *           }
 *         ]
 *     }
 *
 * @apiSuccess (201) {DeviceReading} deviceReading Created device reading is returned as JSON.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "uuid": "6a91cf1d-e241-48c7-955d-4cd470ec5afb",
 *       "timestamp": 1483625834968,
 *       "serverTimestamp": 1483625834968,
 *       "device": "0a1da6bc-eb49-4f31-9bb1-83ed46c1eb80",
 *       "readings":
 *         [
 *           {
 *             "type": "latitude",
 *             "value": "100.01"
 *           },
 *           {
 *             "type": "longitude",
 *             "value": "100.01"
 *           },
 *           {
 *             "type": "charging status",
 *             "value": "discharging"
 *           },
 *           {
 *             "type": "current charge",
 *             "value": "85"
 *           }
 *         ]
 *     }
 *
 * @apiError (400) {String} BadRequest Error code 400 is returned if the JSON format is incorrect.
 * @apiError (500) {String} InternalServerError Error code 500 is returned in case of some error in the server.
 */
exports.addDeviceReading = function (req, res) {
  if (!req || !req.body) {
    console.error('invalid request object');
    return res.status(400).send('Bad Request');
  }

  console.info('req.headers: ' + JSON.stringify(req.headers));
  console.info('req.body: ' + JSON.stringify(req.body));

  var deviceReading = {
    uuid: utils.getUuid(),
    timestamp: req.body.timestamp,
    serverTimestamp: utils.getTimestamp(),
    device: req.body.device,
    readings: [],
  };
  req.body.readings.forEach(function(reading) {
    deviceReading.readings.push(reading);
  });

  console.info('deviceReading: ' + JSON.stringify(deviceReading));

  DeviceReadingManagementService.addDeviceReading(deviceReading, function (err) {
    if (err === 400) {
      console.error('Bad request sent while adding device readings');
      return res.status('400').send('error encountered while adding device reading to DB.  Please check your JSON.');
    }
    if (err) {
      console.error('Internal server error occured while adding device readings');
      return res.status('500').send('error encountered while adding device reading to DB.');
    }

    return res.status('201').send(deviceReading);
  });
};
