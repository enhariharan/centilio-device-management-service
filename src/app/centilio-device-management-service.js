var express = require('express'),
    http = require('http'),
    credentials = require('./configuration'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    PushNotifications = require('./push-notifications'),
    ClientManagementService = require('../services/client-management-service.js'),
    SetupDb = require('../../public/qa/setup-db.js'),
    app = express();

app.set('port', credentials.getPort(app.get('env'))|| 4123);
app.use(express.static(__dirname + '/public'));

//TODO: Right now, CORS is enabled across the board.  Do check and limit this as needed.
// Refer to these links to see how:
// https://github.com/expressjs/cors
// https://stackoverflow.com/questions/7067966/how-to-allow-cors
// http://enable-cors.org/server_expressjs.html
// https://www.npmjs.com/package/cors
app.use(cors()); // enable CORS across the board
app.options('*', cors()); // enable CORS pre-flight reqeusts across the board

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
var opts = { server: { socketOptions: { keepAlive: 1 } } };
mongoose.connect(credentials.getDbConnection(app.get('env')), opts);

// process every request in a domain so that any failure can be gracefully handled.
app.use(function(req, res, next) {
  "use strict";

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
  "use strict";

  res.locals.showTests = app.get('env') !== 'production' &&
    req.query.test === '1';
  next();
});

app.use(function(req, res, next) {
  "use strict";

  var cluster = require('cluster');
  if (cluster.isWorker)
    console.log('worker %d handling request', cluster.worker.id);
    next();
});

require('./routes.js')(app);

// custom 404 page
app.use((req, res) => { res.status(404).render('404'); });

// custom 500 page
app.use((err, req, res, next) => { res.status(500).render('500'); });

// Setup view layout engines.
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// Create the app and start server.
function startServer() {
  "use strict";

  var webServer = http.createServer(app);
  PushNotifications.startWebSocketServer(webServer);
  webServer.listen(app.get('port'), function() {
    console.log('server started on port ' + app.get('port') +
      ' in ' + app.get('env') + ' mode; press Ctrl+C to terminate');
  });
}

// Create the app and start server.
if (require.main === module) {
  startServer();
} else {
  module.exports = startServer;
}
