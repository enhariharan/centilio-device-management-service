var Validator = require('../security/validator');
var Errors = require('../security/errors').errors;

/**
 * @api {post} /events Send an event notification to the device. Only admin can access this URI.
 * @apiName sendEvent
 * @apiGroup Event
 *
 * @apiParam (event) {Event} event Give an event as JSON
 * @apiParamExample {json} Request-header "Content-Type: application/json" must be set.  Request-Example:
 *   {
 *     "device": "491eeac5-f7c5-4c08-a19a-0dc376098702",
 *     "name" : "displayBrightness",
 *     "message" : {
 *       action: "reduce",
 *       value: "3"
 *     }
 *   }
 *
 *   {
 *     "device": "491eeac5-f7c5-4c08-a19a-0dc376098702",
 *     "name" : "playAudio",
 *     "message" : {
 *       "action": "play",
 *       "value": "file-name.mp3"
 *     }
 *   }
 * @apiSuccess (200) {OK} OK.
 *
 * @apiError (400) {String} BadRequest Error code 400 is returned if the JSON format is incorrect.
 * @apiError (403) {String} Unauthorized Error code 403 is returned if credentials are invalid or not admin.
 * @apiError (500) {String} InternalServerError Error code 500 is returned in case of some error in the server.
 */
exports.sendEvent = (req, res) => {

  var event = req.body;
  console.log('\nevent received: ' + JSON.stringify(event));

  Validator.isUserAdmin(req)
  .then(result => {
    if (!event || event === undefined) throw(Errors.emptyOrUnknownEvent);
    return eventsManagementService.sendEventNotification(event);
  })
  .then(event => {
    console.log('\nevent posted: ' + JSON.stringify(event));
    res.sendStatus(200);
  })
  .catch(err => {
    console.error('Err: %s', JSON.stringify(err));
    return res.status(err.code).send(err);
  });
};
