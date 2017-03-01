exports.errors = {
  invalidCredentials: {code: '403', reason: 'invalid credentials.'},
  emptyCredentials: {code: '403', reason: 'empty credentials.'},
  emptyClientRole: {code: '400', reason: 'client role cannot be empty.'},
  invalidClientRole: {code: '400', reason: 'invalid value of role was provided. Please provide the correct UUID.'},
  emptyClientAddresses: {code: '400', reason: 'client address cannot be empty.'},
  emptyClientEmails: {code: '400', reason: 'client email cannot be empty.'},
  emptyReqBody: {code: '400', reason: 'request body is empty or not present'},
  invalidClientUuid: {code: '400', reason: 'client with given UUID was not found.'},
  errAddingClient: {code: '500', reason: 'error adding client to DB.'},
  userNotFound: {code: '400', reason: 'user with given username not found.'},
};
