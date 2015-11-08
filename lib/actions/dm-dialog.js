'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var request = _request2['default'].defaults({ strictSSL: false });

var DOCOMO_API = "https://api.apigw.smt.docomo.ne.jp/dialogue/v1/dialogue?APIKEY=";
var DOCOMO_TOKEN = process.env.BOT_DOCOMO_TOKEN;

var DMDialog = (function () {
  function DMDialog() {
    _classCallCheck(this, DMDialog);
  }

  _createClass(DMDialog, null, [{
    key: 'start',
    value: function start(adapter) {
      var api = adapter.api;
      var stream = api.stream('user');

      var status = {};
      stream.on('direct_message', function (data) {
        var message = data.direct_message;

        if (message.sender_id_str === adapter.id) return;

        status.utt = message.text;
        status.nickname = message.sender_screen_name;

        var param = { body: JSON.stringify(status) };
        request.post('' + DOCOMO_API + DOCOMO_TOKEN, param, function (err, res, data) {
          var body = JSON.parse(data);
          var reply = {
            user_id: message.sender_id_str,
            text: body.utt
          };

          status.context = body.context;
          status.mode = body.mode;

          api.post('direct_messages/new', reply, function (err, data, res) {});
        });
      });
    }
  }]);

  return DMDialog;
})();

exports['default'] = DMDialog;
module.exports = exports['default'];