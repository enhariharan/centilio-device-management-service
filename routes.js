// var Device = require('./models/device.js');
var bodyparser = require('body-parser');
var jsonParser = bodyparser.json();

var main = require('./controllers/main.js');
var devices = require('./controllers/devices-controller.js');

module.exports = function(app) {
  "use strict";

  app.use(jsonParser);

  app.get("/", main.home);
  app.get('/about', main.about);

  app.get('/devices', devices.getAllDevices);

  app.post('/devices', jsonParser, devices.addDevice);
};
