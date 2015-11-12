import co from 'co';

export default function start(adapter) {
  let api = adapter.api;
  let stream = api.stream('user');

  stream.on('follow', (data) => {
    co(function *() {
      if (data.source.id_str === adapter.id) return;
      let param = {user_id: data.source.id_str};
      yield api.post('friendships/create', param);
    }).catch(err => {
      console.log(err);
    });
  });
}
