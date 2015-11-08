import koa from 'koa';
import route from 'koa-route'
import koko from './app';

koko().start();

var server = koa();

server.use(route.get('/', function *() {
  this.body = 'hello world';
}));

var port = process.env.PORT || 3000;
server.listen(port);
console.log('listening on port : ' + port);
