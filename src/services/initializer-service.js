var Setup = require('../../public/qa/setup-db.js');
exports.initialize = () => {
  return new Promise(
    (resolve, reject) => {
      Setup.setupDB()
      .then(result => {
        if (result !== false) resolve(result);
      })
      .catch(err => { reject(err); });
  })
}