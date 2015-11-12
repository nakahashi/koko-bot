'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = start;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _coRequest = require('co-request');

var _coRequest2 = _interopRequireDefault(_coRequest);

var _modelsUser = require('../models/user');

var _modelsUser2 = _interopRequireDefault(_modelsUser);

var DOCOMO_API = "https://api.apigw.smt.docomo.ne.jp/dialogue/v1/dialogue?APIKEY=";
var DOCOMO_TOKEN = process.env.BOT_DOCOMO_TOKEN;

function start(adapter) {
  var api = adapter.api;
  var stream = api.stream('user');

  stream.on('direct_message', function (rcv) {
    var message = rcv.direct_message;
    var sender_id = message.sender_id_str;

    (0, _co2['default'])(function* () {
      if (sender_id === adapter.id) return;

      var foundUser = yield _modelsUser2['default'].find(sender_id);
      var user = foundUser ? foundUser : new _modelsUser2['default'](sender_id);
      var result = yield postDocomoDialog(user, message);

      var body = JSON.parse(result);
      user.context = body.context;
      yield user.save();

      var reply = { user_id: sender_id, text: body.utt };
      yield api.post('direct_messages/new', reply);
    })['catch'](function (err) {
      console.log(err);
    });
  });
}

function* postDocomoDialog(user, message) {
  var status = {};
  status.utt = message.text;
  status.nickname = message.sender_screen_name;
  if (user.context) status.context = user.context;

  var request = _coRequest2['default'].defaults({ strictSSL: false });
  var param = { body: JSON.stringify(status) };
  var result = yield request.post('' + DOCOMO_API + DOCOMO_TOKEN, param);

  return result.body;
}
module.exports = exports['default'];