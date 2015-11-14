import co from 'co';
import req from 'co-request';
import User from '../models/user';

const DOCOMO_API = "https://api.apigw.smt.docomo.ne.jp/dialogue/v1/dialogue?APIKEY="
const DOCOMO_TOKEN = process.env.BOT_DOCOMO_TOKEN;

export default function start(adapter) {
  let api = adapter.api;
  let stream = api.stream('user');

  stream.on('direct_message', rcv => {
    let message = rcv.direct_message;
    let sender_id = message.sender_id_str;

    co(function *() {
      if (sender_id === adapter.id) return;

      let foundUser = yield User.find(sender_id);
      let user = foundUser ? foundUser : new User(sender_id);
      let result = yield postDocomoDialog(user, message);

      user.context = result.context;
      yield user.save();

      let reply = { user_id: sender_id, text: result.utt };
      yield api.post('direct_messages/new', reply);
    }).catch(err => {
      console.log(err);
    });
  });
}

function *postDocomoDialog(user, message) {
  let status = {}
  status.utt = message.text;
  status.nickname = message.sender_screen_name;
  if (user.context) status.context = user.context;

  let request = req.defaults({strictSSL: false});
  let param = {body: JSON.stringify(status)};
  let result = yield request.post(`${DOCOMO_API}${DOCOMO_TOKEN}`, param);

  return JSON.parse(result.body);
}
