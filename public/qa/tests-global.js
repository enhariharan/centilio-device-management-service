suite('Global tests', function() {
  test('page should contain a valid title', function() {
    assert(document.title &&
      document.title.match(/\S/) &&
      document.title.toUpperCase() !== 'TODO');
  });
});
