import req from 'request';
let request = req.defaults({strictSSL: false});

const DOCOMO_API = "https://api.apigw.smt.docomo.ne.jp/dialogue/v1/dialogue?APIKEY="
const DOCOMO_TOKEN = process.env.BOT_DOCOMO_TOKEN;

export default class DMDialog {
  static start(adapter) {
    let api = adapter.api;
    let stream = api.stream('user');

    let status = {};
    stream.on('direct_message', (data) => {
      console.log(data);
      let message = data.direct_message;

      if (message.sender_id_str === adapter.id) return;

      status.utt = message.text;
      status.nickname = message.sender_screen_name;

      let param = {body: JSON.stringify(status)};
      request.post(`${DOCOMO_API}${DOCOMO_TOKEN}`, param, (err, res, data) => {
        let body = JSON.parse(data);
        let reply = {
          user_id: message.sender_id_str,
          text: body.utt
        };

        status.context = body.context;
        status.mode = body.mode;

          console.log(reply);
        api.post('direct_messages/new', reply, (err, data, res) => {});
      });
    });
  }
}
