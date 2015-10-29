var Twit = require('twit');

var twitter = new Twit({
  consumer_key: process.env.BOT_TWITTER_KEY,
  consumer_secret: process.env.BOT_TWITTER_SECRET,
  access_token: process.env.BOT_TWITTER_TOKEN,
  access_token_secret: process.env.BOT_TWITTER_TOKEN_SECRET
});

var Bot = require('./lib/bot');
var adapter = {api: twitter, id: process.env.BOT_TWITTER_ID};
var koko = new Bot(adapter);

module.exports = koko;
