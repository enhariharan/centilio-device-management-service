exports.home = function(req, res) {
  "use strict";
  res.render('home');
};

exports.about = function(req, res) {
  "use strict";
  res.render('about', { pageTestScript: '/qa/tests-about.js' });
};
