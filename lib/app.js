'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _twit = require('twit');

var _twit2 = _interopRequireDefault(_twit);

var _bot = require('./bot');

var _bot2 = _interopRequireDefault(_bot);

var twitter = new _twit2['default']({
  consumer_key: process.env.BOT_TWITTER_KEY,
  consumer_secret: process.env.BOT_TWITTER_SECRET,
  access_token: process.env.BOT_TWITTER_TOKEN,
  access_token_secret: process.env.BOT_TWITTER_TOKEN_SECRET
});

module.exports = new _bot2['default']({
  api: twitter,
  id: process.env.BOT_TWITTER_ID
});