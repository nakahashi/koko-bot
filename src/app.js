import Twit from 'twit';
import Bot from './bot';

let twitter = new Twit({
  consumer_key: process.env.BOT_TWITTER_KEY,
  consumer_secret: process.env.BOT_TWITTER_SECRET,
  access_token: process.env.BOT_TWITTER_TOKEN,
  access_token_secret: process.env.BOT_TWITTER_TOKEN_SECRET
});

module.exports = new Bot({
  api: twitter,
  id: process.env.BOT_TWITTER_ID
});
