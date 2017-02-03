var utils = require('../models/utilities'),
    DeviceReadingManagementService = require('../services/device-reading-management-service'),
    DeviceManagementService = require('../services/device-management-service'),
    User = require('../models/user-model').User,
    UserManagementService = require('../services/user-management-service'),
    BasicAuth = require('basic-auth');

/**
 * @api {get} /deviceReadings Get device readings of all devices belonging to the logged in user.
 * @apiName getAllDeviceReadings
 * @apiGroup Device Readings
 *
 * @apiParam latestOnly - If this param is set to true (/devicereadings?latestOnly=true) then only the latest
 * reading per device is returned.  Else all device readings of all devices of the user are returned.
 * @apiParam from - If this param is set (/devicereadings?from=timestamp) then all readings from the
 * given timestamp till the present moment are returned.
 * @apiParam to - If this param is set (/devicereadings?to=timestamp) then all readings from the
 * beginning to the given timestamp are returned.
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
 exports.getAllDeviceReadings = (req, res) => {
   "use strict";

   var credentials = BasicAuth(req); // TODO: Change this to JWT based stateless token based authentication
   if (credentials === undefined || !credentials) return res.sendStatus(403);

   User.find({username: credentials.name}).exec().then(user => {
     if (!user || user === undefined || credentials.name.toLowerCase().localeCompare(user[0].username.toLowerCase()) || credentials.pass.localeCompare(user[0].password)) return res.sendStatus(403);
     return DeviceManagementService.getDevicesByClient(user[0].client);
   })
   .then(devices => {
     return DeviceReadingManagementService.getAllDeviceReadingsByDevices(devices.devices, req.query.latestOnly === 'true', req.query.from, req.query.to);
   })
   .then(deviceReadings => {return res.status('200').send(deviceReadings);})
   .catch(err => {console.log('err: ' + err);});
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
exports.getDeviceReading = (req, res) => {
  "use strict";
  var uuid = req.params.uuid;
  DeviceReadingManagementService.getDeviceReading(uuid, (err, context) => {
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
  if (!req || !req.body) return res.sendStatus(400);
  if (req.body.device === undefined || req.body.device === null) return res.sendStatus(400);

  var deviceReading = {
    uuid: utils.getUuid(),
    timestamp: req.body.timestamp,
    serverTimestamp: utils.getTimestamp(),
    device: req.body.device,
    readings: [],
  };
  req.body.readings.forEach(r => {deviceReading.readings.push(r);});

  DeviceReadingManagementService.addDeviceReading(deviceReading)
  then(savedDeviceReading => {
    return res.status('201').send(savedDeviceReading);
  })
  .catch(err => {
    if (err === 400) {
      console.error('error encountered while adding device reading to DB.  Please check your JSON.');
      return res.sendStatus('400');
    }
    console.error('Internal server error occured while adding device readings ' + err);
    return res.sendStatus('500');
  });
};
