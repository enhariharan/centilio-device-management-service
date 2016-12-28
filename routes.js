var Device = require('./models/device.js');
var bodyparser = require('body-parser');
var jsonParser = bodyparser.json();

var main = require('./controllers/main.js');
var devices = require('./controllers/devices.js');

module.exports = function(app) {
  "use strict";

  app.use(jsonParser);

  app.get("/", main.home);
  app.get('/about', main.about);

  app.get('/devices', devices.getAllDevices);

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
