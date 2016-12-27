var express = require('express');
var http = require('http');
var bodyparser = require('body-parser');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));
app.use(bodyparser());

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

// proces every request in a domain so that any failure can be gracefully handled.
app.use(function(req, res, next) {
  // create a domain for this request
  var domain = require('domain').create();

  // handle errors raised on this domain
  domain.on('error', function(err) {
    console.console.error('*** ALERT ***: domain error caught\n', err.stack);
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
      };
    } catch(err) {
      console.error('Unable to send HTTP code 500 as response', err.stack);
    };
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

// Handle / route. NOTE: This method SHOULD stay above 404 handler method
app.get('/', function(req, res){
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
};

// Create the app and start server.
if (require.main === module) {
  startServer();
} else {
  module.exports = startServer;
}
