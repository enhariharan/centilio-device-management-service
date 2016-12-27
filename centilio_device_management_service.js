var express = require('express');

var app = express();

app.set('port', process.env.PORT || 3000);

// cuatom 404 page
app.use(function(req, res) {
  console.error('404 - Page not found');
  res.type('text/plain');
  res.status(404);
  res.send('404 - Page not found');
});

// custom 500 page
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.type('text/plain');
  res.status(500);
  res.send('500 - Internal server error');
});

// start server
app.listen(app.get('port'), function(){
  console.log('server started on http://localhost:' + app.get('port') +
    '; press Ctrl+C to terminate');
});
