Package.describe({
  name: 'rgnevashev:select2',
  version: '4.0.2',
  summary: 'Select2 is a jQuery based replacement for select boxes',
  git: 'https://github.com/rgnevashev/select2',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.use(['jquery@1.11.4']);
  api.addFiles([
    "dist/css/select2.css",
    "dist/css/select2-bootstrap.css",
    "dist/js/select2.js"
  ], 'client', {bare: true});
});
