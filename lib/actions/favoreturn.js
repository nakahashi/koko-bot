'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = start;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

function start(adapter) {
  var api = adapter.api;
  var stream = api.stream('user');

  stream.on('follow', function (data) {
    (0, _co2['default'])(function* () {
      if (data.source.id_str === adapter.id) return;
      var param = { user_id: data.source.id_str };
      yield api.post('friendships/create', param);
    })['catch'](function (err) {
      console.log(err);
    });
  });
}

module.exports = exports['default'];