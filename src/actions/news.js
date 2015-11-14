import Request from 'request';
import req from 'co-request';
import FeedParser from 'feedparser';
import co from 'co';

const MINUTE = 1000 * 60;
const HOUR = MINUTE * 60;

export default function start(adapter) {
  setInterval(() => {
    co(function *() {
      let news = yield fetchNews();
      news.title = removeNoiseFromTitle(news.title)
      let comment = yield fetchComment(news.title);

      let status = `${comment.utt}\n${news.title} ${news.link}`
      yield adapter.api.post('statuses/update', {status});
    }).catch(err => {
      console.log(err);
    });
  }, 4 * HOUR);
}

function removeNoiseFromTitle(title){
  let result = title;

  let matchies = title.match(/（.*?\）/g);
  if (matchies) {
    result = title.replace(matchies.pop(), '');
  }

  result.replace('<', '');

  return result;
}

const DOCOMO_API = "https://api.apigw.smt.docomo.ne.jp/dialogue/v1/dialogue?APIKEY="
const DOCOMO_TOKEN = process.env.BOT_DOCOMO_TOKEN;

function *fetchComment(utt) {
  let status = {utt, sex:'女'};

  let request = req.defaults({strictSSL: false});
  let param = {body: JSON.stringify(status)};
  let result = yield request.post(`${DOCOMO_API}${DOCOMO_TOKEN}`, param);

  return JSON.parse(result.body);
}

const SPA = 'http://zasshi.news.yahoo.co.jp/rss/sspa-all.xml';
const R25 = 'http://zasshi.news.yahoo.co.jp/rss/rnijugo-all.xml'
const SPONITCHI = 'http://headlines.yahoo.co.jp/rss/spnannex-c_spo.xml'
const RSSs = [SPA, R25, SPONITCHI];
const LINK_LIMIT = 20;
const HISTORY_NUM = 100;

let history = [];
let rssIndex = 0;

function *fetchNews() {
  let items = yield fetchRss(RSSs[rssIndex], LINK_LIMIT);
  let item = items.find((ss) => {
    return (-1 === history.indexOf(ss.link));
  });

  history.push(item.link);
  if (history.length > HISTORY_NUM) history.shift();

  rssIndex++;
  if (rssIndex >= RSSs.length) rssIndex = 0;

  let news = {title: item.title, link: item.link};
  return news;
}

function fetchRss(url, limit) {
  let request = Request(url);
  let feedparser = new FeedParser({addmeta: false});
  let items = [];

  return new Promise((resolve, reject) => {
    request.on('error', (err) => {
      reject(err);
    });
    request.on('response', (res) => {
      if (res.statusCode != 200) reject(new Error('Bad status code'));

      request.pipe(feedparser);
    });

    feedparser.on('error', (err) => {
      reject(err);
    });
    feedparser.on('readable', () => {
      let item;
      while (item = feedparser.read()) {
        items.push(item);
        if (items.length > limit) items.shift();
      }
    });
    feedparser.on('end', () => {
      resolve(items);
    });
  });
}
