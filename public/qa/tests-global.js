var assert = require('chai').assert;

suite('Global tests', () => {
  test('page should contain a valid title', () => {
    assert(document.title &&
      document.title.match(/\S/) &&
      document.title.toUpperCase() !== 'TODO');
  });
});
