if (__PRODUCTION__) {
  module.exports = require('./App.prod');
} else {
  module.exports = require('./App.dev');
}
