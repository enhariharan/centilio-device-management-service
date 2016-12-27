var express = require('express');
var bodyparser = require('body-parser');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));
app.use(bodyparser());

// Detect if pageload url has test=1 in query.  If so, enable pagetest mode.
app.use(function(req, res, next) {
  console.log('1');
  res.locals.showTests = app.get('env') !== 'production' &&
    req.query.test === '1';
  next();
});

// Handle / route. NOTE: This method SHOULD stay above 404 handler method
app.get('/', function(req, res){
  console.log('2');
  res.render('home');
});

// Handle /about route. NOTE: This method SHOULD stay above 404 handler method
app.get('/about', function(req, res){
  console.log('3');
  res.render('about', { pageTestScript: '/qa/tests-about.js' });
});

// cuatom 404 page
app.use(function(req, res) {
  console.log('4');
  console.error('404 - Page not found');
  res.status(404);
  res.render('404');
});

// custom 500 page
app.use(function(err, req, res, next) {
  console.log('5');
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

// Setup view layout engines.
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// Create the app and start server.
app.listen(app.get('port'), function(){
  console.log('server started on http://localhost:' + app.get('port') +
    ' in ' + app.get('env') + ' mode; press Ctrl+C to terminate');
});
