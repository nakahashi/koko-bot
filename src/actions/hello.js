export default class Hello {
  static start(adapter) {
    let api = adapter.api;
    let param = {status: 'hello world!'};

    api.post('statuses/update', param, (err, data, response) => {
      console.log(data);
    });
  }
}
