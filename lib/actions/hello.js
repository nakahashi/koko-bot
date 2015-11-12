'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = start;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

function start(adapter) {
  (0, _co2['default'])(function* () {
    var api = adapter.api;
    var param = { status: 'hello world!' };
    yield api.post('statuses/update', param);
  })['catch'](function (err) {
    console.log(err);
  });
}

module.exports = exports['default'];