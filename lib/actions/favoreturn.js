'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Favoreturn = (function () {
  function Favoreturn() {
    _classCallCheck(this, Favoreturn);
  }

  _createClass(Favoreturn, null, [{
    key: 'start',
    value: function start(adapter) {
      var api = adapter.api;
      var stream = api.stream('user');

      stream.on('follow', function (data) {
        if (data.source.id_str === adapter.id) return;

        var param = { user_id: data.source.id_str };
        api.post('friendships/create', param, function (err, data, resp) {
          if (err) console.log(data);
        });
      });
    }
  }]);

  return Favoreturn;
})();

exports['default'] = Favoreturn;
module.exports = exports['default'];