export default class Favoreturn {
  static start (adapter) {
    let api = adapter.api;
    let stream = api.stream('user');

    stream.on('follow', (data) => {
      if (data.source.id_str === adapter.id) return;

      let param = {user_id: data.source.id_str};
      api.post('friendships/create', param, (err, data, resp) => {
        if (err) console.log(data);
      });
    });
  }
}
