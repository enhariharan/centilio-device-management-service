var express = require('express');

var app = express();

app.set('port', process.env.PORT || 3000);

// Handle / route. NOTE: This method SHOULD stay above 404 handler method
app.get('/', function(req, res){
  res.render('home');
});

// Handle /about route. NOTE: This method SHOULD stay above 404 handler method
app.get('/about', function(req, res){
  res.render('about');
});

// cuatom 404 page
app.use(function(req, res) {
  console.error('404 - Page not found');
  res.status(404);
  res.render('404');
});

// custom 500 page
app.use(function(err, req, res, next) {
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
    '; press Ctrl+C to terminate');
});
