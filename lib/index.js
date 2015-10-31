'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaRoute = require('koa-route');

var _koaRoute2 = _interopRequireDefault(_koaRoute);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

_app2['default'].start();

var server = (0, _koa2['default'])();

// ここで()=>を使うとthisの扱いが変わって受け付けられなくなる。しょぼい。。
server.use(_koaRoute2['default'].get('/', function* () {
  this.body = 'hello world';
}));

var port = process.env.PORT || 3000;
server.listen(port);
console.log('listening on port : ' + port);