'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = start;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _coRequest = require('co-request');

var _coRequest2 = _interopRequireDefault(_coRequest);

var _feedparser = require('feedparser');

var _feedparser2 = _interopRequireDefault(_feedparser);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var MINUTE = 1000 * 60;
var HOUR = MINUTE * 60;

function start(adapter) {
  setInterval(function () {
    (0, _co2['default'])(function* () {
      var news = yield fetchNews();
      news.title = removeNoiseFromTitle(news.title);
      var comment = yield fetchComment(news.title);

      var status = comment.utt + '\n' + news.title + ' ' + news.link;
      yield adapter.api.post('statuses/update', { status: status });
    })['catch'](function (err) {
      console.log(err);
    });
    //  }, 4 * HOUR);
  }, 4000);
}

function removeNoiseFromTitle(title) {
  var result = title;

  var matchies = title.match(/（.*?\）/g);
  if (matchies) {
    result = title.replace(matchies.pop(), '');
  }

  result.replace('<', '');

  return result;
}

var DOCOMO_API = "https://api.apigw.smt.docomo.ne.jp/dialogue/v1/dialogue?APIKEY=";
var DOCOMO_TOKEN = process.env.BOT_DOCOMO_TOKEN;

function* fetchComment(utt) {
  var status = { utt: utt, sex: '女' };

  var request = _coRequest2['default'].defaults({ strictSSL: false });
  var param = { body: JSON.stringify(status) };
  var result = yield request.post('' + DOCOMO_API + DOCOMO_TOKEN, param);

  return JSON.parse(result.body);
}

var SPA = 'http://zasshi.news.yahoo.co.jp/rss/sspa-all.xml';
var R25 = 'http://zasshi.news.yahoo.co.jp/rss/rnijugo-all.xml';
var SPONITCHI = 'http://headlines.yahoo.co.jp/rss/spnannex-c_spo.xml';
var RSSs = [SPA, R25, SPONITCHI];
var LINK_LIMIT = 20;
var HISTORY_NUM = 100;

var history = [];
var rssIndex = 0;

function* fetchNews() {
  var items = yield fetchRss(RSSs[rssIndex], LINK_LIMIT);
  var item = items.find(function (ss) {
    return -1 === history.indexOf(ss.link);
  });

  history.push(item.link);
  if (history.length > HISTORY_NUM) history.shift();

  rssIndex++;
  if (rssIndex >= RSSs.length) rssIndex = 0;

  var news = { title: item.title, link: item.link };
  return news;
}

function fetchRss(url, limit) {
  var request = (0, _request2['default'])(url);
  var feedparser = new _feedparser2['default']({ addmeta: false });
  var items = [];

  return new Promise(function (resolve, reject) {
    request.on('error', function (err) {
      reject(err);
    });
    request.on('response', function (res) {
      if (res.statusCode != 200) reject(new Error('Bad status code'));

      request.pipe(feedparser);
    });

    feedparser.on('error', function (err) {
      reject(err);
    });
    feedparser.on('readable', function () {
      var item = undefined;
      while (item = feedparser.read()) {
        items.push(item);
        if (items.length > limit) items.shift();
      }
    });
    feedparser.on('end', function () {
      resolve(items);
    });
  });
}
module.exports = exports['default'];