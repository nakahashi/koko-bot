'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports['default'] = koko;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _twit = require('twit');

var _twit2 = _interopRequireDefault(_twit);

var _thunkify = require('thunkify');

var _thunkify2 = _interopRequireDefault(_thunkify);

/**
 * Bot本体の動作を定義するクラスです。
 */

var Bot = (function () {
  /**
   * @param {Object} adapter - ボットが動作するサービスとのアダプタ
   * @param {Twit} adapter.api - サービスとのAPIの実装（当面Twitのインスタンス）
   * @param {string} adapter.id - サービス上のID
   */

  function Bot(adapter) {
    _classCallCheck(this, Bot);

    this.adapter = adapter;
  }

  /**
   * Twitterに接続したBotインスタンスを生成します。
   * @returns {Bot}
   */

  /**
   * ボットを起動します。
   * このとき、'./action'フォルダ内にある全jsのstart()メソッドをコールします。
   */

  _createClass(Bot, [{
    key: 'start',
    value: function start() {
      var _this = this;

      var DIRECTORY = 'actions';
      var EXT = '.js';

      _fs2['default'].readdir(__dirname + '/' + DIRECTORY, function (err, files) {
        if (err) throw err;

        files.filter(function (file) {
          return _path2['default'].extname(file) === EXT;
        }).map(function (file) {
          return './' + DIRECTORY + '/' + file;
        }).forEach(function (action) {
          require(action)(_this.adapter);
        });
      });

      console.log('bot start!');
    }
  }]);

  return Bot;
})();

exports.Bot = Bot;

function koko() {
  var twitter = new _twit2['default']({
    consumer_key: process.env.BOT_TWITTER_KEY,
    consumer_secret: process.env.BOT_TWITTER_SECRET,
    access_token: process.env.BOT_TWITTER_TOKEN,
    access_token_secret: process.env.BOT_TWITTER_TOKEN_SECRET
  });

  twitter.post = (0, _thunkify2['default'])(twitter.post);
  var koko = new Bot({
    api: twitter,
    id: process.env.BOT_TWITTER_ID
  });

  return koko;
}