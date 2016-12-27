var express = require('express');
var http = require('http');
var bodyparser = require('body-parser');
var credentials = require('./credentials.js');
var mongoose = require('mongoose');
var app = express();
var Device = require('./models/device.js');
var jsonParser = bodyparser.json();

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));
app.use(jsonParser);

// configure loggers as per environment
switch (app.get('env')) {
  case 'development':
  case 'test':
    app.use(require('morgan')('dev'));
    break;
  case 'production':
    app.use(require('express-logger')({
      path: __dirname + '/log/requests.log'
    }));
    break;
}

// configure mongoose to connect to our MongoDB database
var opts = {
  server: {
    secketOptions: { keepAlive: 1 }
  }
};
switch(app.get('env')) {
  case 'development':
    mongoose.connect(credentials.mongo.development.connectionString, opts);
    break;
  case 'test':
    mongoose.connect(credentials.mongo.test.connectionString, opts);
    break;
  case 'production':
    mongoose.connect(credentials.mongo.production.connectionString, opts);
    break;
  default:
    throw new Error('Unknown execution environment: ' + app.get('env'));
  }

// TODO: Remove the below block of code. THIS CODE IS HERE ONLY FOR TESTINS PURPOSES.
// v-----------------------------v
// v          from here          v
// v-----------------------------v
Device.find(function(err, devices) {
  if (devices.length) {
    console.log('devices collection is not empty');
    return;
  }

  new Device({
    uuid: '0123456789012345678901234567890123456789012345678901234567890123',
    name: 'Device 01',
  }).save();

  new Device({
    uuid: '0123456789012345678901234567890123456789012345678901234567890124',
    name: 'Device 02',
  }).save();
});
// ^-----------------------------^
// ^          till here          ^
// ^-----------------------------^

// proces every request in a domain so that any failure can be gracefully handled.
app.use(function(req, res, next) {
  // create a domain for this request
  var domain = require('domain').create();

  // handle errors raised on this domain
  /* jshint -W002 */
  domain.on('error', function(err) {
    console.error('*** ALERT ***: domain error caught\n', err.stack);
    try {
      // failsafe procedure, shut down in 5 secs
      setTimeout(function(){
        console.error('failsafe shutdown activated.');
        process.exit(1);
      }, 5000);

      // disconnect from cluster
      var worker = require('cluster').worker;
      if (worker) worker.disconnect();

      // and stop taking new requests
      server.close();

      // attempt to send back HTTP error code 500 through express route
      try {
        next(err);
      } catch(err) {
        // express route failed.  Send HTTP error 500 as Node response.
        console.error('express error mechanism failed. Trying node response...', err.stack);
        res.statusCode = 500;
        res.setHeader("content-type", "text/plain");
        res.end("500 - Internal server error");
      }
    } catch(err) {
      console.error('Unable to send HTTP code 500 as response', err.stack);
    }
  });

  // add req and re objects to domain
  domain.add(req);
  domain.add(res);

  // execute the rest of the pipeline in the domain
  domain.run(next);
});

// Detect if pageload url has test=1 in query.  If so, enable pagetest mode.
app.use(function(req, res, next) {
  res.locals.showTests = app.get('env') !== 'production' &&
    req.query.test === '1';
  next();
});

app.use(function(req, res, next) {
  var cluster = require('cluster');
  if (cluster.isWorker)
    console.log('worker %d handling request', cluster.worker.id);
    next();
});

// Handle /devices GET route. NOTE: This method SHOULD stay above 404 handler method
app.get('/devices', function (req, res) {
  Device.find(function (err, devices) {
    if (err) return console.error('err = ' + err);
    if (!devices.length) {
      console.info('No devices found in DB...');
      return res.status('200').send('No devices found in DB...');
    }

    var context = {
      devices: devices.map(function(device) {
        dev = {
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

// Handle /devices POST route. NOTE: This method SHOULD stay above 404 handler method
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

// Handle / route. NOTE: This method SHOULD stay above 404 handler method
app.get('/', function(req, res) {
  res.render('home');
});

// Handle /about route. NOTE: This method SHOULD stay above 404 handler method
app.get('/about', function(req, res){
  res.render('about', { pageTestScript: '/qa/tests-about.js' });
});

// cuatom 404 page
app.use(function(req, res) {
  console.error('404 - Page not found');
  res.status(404).render('404');
});

// custom 500 page
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).render('500');
});

// Setup view layout engines.
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// Create the app and start server.
function startServer() {
  http.createServer(app).listen(app.get('port'), function() {
    console.log('server started on http://localhost:' + app.get('port') +
      ' in ' + app.get('env') + ' mode; press Ctrl+C to terminate');
  });
}

// Create the app and start server.
if (require.main === module) {
  startServer();
} else {
  module.exports = startServer;
}
