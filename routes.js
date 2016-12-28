var Device = require('./models/device.js');
var bodyparser = require('body-parser');
var jsonParser = bodyparser.json();

module.exports = function(app) {
  "use strict";

  app.use(jsonParser);

  app.get("/", function(req, res) {
    res.render('home');
  });

  app.get('/about', function(req, res){
    res.render('about', { pageTestScript: '/qa/tests-about.js' });
  });

  app.get('/devices', function (req, res) {
    Device.find(function (err, devices) {
      if (err) return console.error('err = ' + err);
      if (!devices.length) {
        console.info('No devices found in DB...');
        return res.status('200').send('No devices found in DB...');
      }

      var context = {
        devices: devices.map(function(device) {
          var dev = {
            name: device.name,
            uuid: device.uuid,
            latitude: device.latitude,
            longitude: device.longitude,
            status: device.status,
          };
          return dev;
        }),
      };
      return res.send(context);
    });
  });

  app.post('/devices', jsonParser, function (req, res) {
    if (!req || !req.body) {
      console.error('invalid request object');
      return res.status(400).send('Bad Request');
    }

    var device = new Device({
      uuid: req.body.uuid,
      name: req.body.name,
    });
    console.log(device);

    device.save(function(err) {
      if (err) {
        console.log('Error while saving to database.');
        return res.status(500).send('Internal server error');
      }

      return res.status(201).send("Created");
    });
  });
};
