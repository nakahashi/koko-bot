import co from 'co';

export default function start(adapter) {
  co(function *() {
    let api = adapter.api;
    let param = {status: 'hello world!'};
    yield api.post('statuses/update', param);
  }).catch(err => {
    console.log(err);
  });
}
