import fs from 'fs';
import path from 'path';
import Twit from 'twit';

/**
 * Bot本体の動作を定義するクラスです。
 */
export class Bot {
  /**
   * @param {Object} adapter - ボットが動作するサービスとのアダプタ
   * @param {Twit} adapter.api - サービスとのAPIの実装（当面Twitのインスタンス）
   * @param {string} adapter.id - サービス上のID
   */
  constructor(adapter) {
    this.adapter = adapter;
  }

  /**
   * ボットを起動します。
   * このとき、'./action'フォルダ内にある全jsのクラスが持つstart()メソッドをコールします。
   */
  start() {
    const DIRECTORY = 'actions';
    const EXT = '.js';

    fs.readdir(`${__dirname}/${DIRECTORY}`, (err, files) => {
      if (err) throw err;

      files.filter(file => {
        return path.extname(file) === EXT;
      }).map(file => {
        return `./${DIRECTORY}/${file}`;
      }).forEach(action => {
        require(action).start(this.adapter);
      });
    });

    console.log('bot start!');
  }
}

/**
 * Twitterに接続したBotインスタンスを生成します。
 * @returns {Bot}
 */
export default function koko() {
  let twitter = new Twit({
    consumer_key: process.env.BOT_TWITTER_KEY,
    consumer_secret: process.env.BOT_TWITTER_SECRET,
    access_token: process.env.BOT_TWITTER_TOKEN,
    access_token_secret: process.env.BOT_TWITTER_TOKEN_SECRET
  });

  let koko = new Bot({
    api: twitter,
    id: process.env.BOT_TWITTER_ID
  });

  return koko;
}
