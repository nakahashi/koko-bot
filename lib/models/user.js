'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _dynamodbDoc = require('dynamodb-doc');

var _dynamodbDoc2 = _interopRequireDefault(_dynamodbDoc);

require('babel/polyfill');

var TABLENAME = 'users';
var db = new _awsSdk2['default'].DynamoDB({ region: 'ap-northeast-1' });
var doc = new _dynamodbDoc2['default'].DynamoDB(db);

/**
 * AWSのDynamoDBに格納するユーザ情報のモデルです。
 */

var User = (function () {
  /**
   * @param {string} id - ユーザID
   */

  function User(id) {
    _classCallCheck(this, User);

    /**
    * @type {string} id
    * @type {string} context
     */
    this.id = id;
    this.context = '';
  }

  /**
   * ユーザ情報を保存します。
   * @returns {Promise<Error>}
   */

  _createClass(User, [{
    key: 'save',
    value: function save() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var params = {};
        params.TableName = TABLENAME;
        params.Item = { 'id': _this.id, 'context': _this.context };

        doc.putItem(params, function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }

    /**
     * 全てのユーザ情報を取得します。
     * @returns {Promise<User[], Error>} ユーザ情報配列
     */
  }], [{
    key: 'all',
    value: function all() {
      return new Promise(function (resolve, reject) {
        var params = {};
        params.TableName = TABLENAME;
        params.Select = 'ALL_ATTRIBUTES';

        doc.scan(params, function (err, res) {
          if (err) {
            reject(err);
          }

          var users = [];
          if (res.Count > 0) {
            users = res.Items.map(function (item) {
              return createUser(item);
            });
          }
          resolve(users);
        });
      });
    }

    /**
     * ユーザ情報を取得します。
     * @param {string} id - ユーザID
     * @returns {Promise<User, Error>} ユーザ情報
     */
  }, {
    key: 'find',
    value: function find(id) {
      return new Promise(function (resolve, reject) {
        var params = {};
        params.TableName = TABLENAME;
        params.Key = { id: id };

        doc.getItem(params, function (err, data) {
          if (err) {
            reject(err);
          }

          var user = data.Item ? createUser(data.Item) : null;
          resolve(user);
        });
      });
    }

    /**
     * ユーザ情報を破棄します。
     * @param {string} id - ユーザID
     * @returns {Promise<Error>}
     */
  }, {
    key: 'destroy',
    value: function destroy(id) {
      return new Promise(function (resolve, reject) {
        User.find(id).then(function (user) {
          var params = {};
          params.TableName = TABLENAME;
          params.Key = { id: id };

          doc.deleteItem(params, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        })['catch'](function (err) {
          reject(err);
        });
      });
    }
  }]);

  return User;
})();

exports['default'] = User;

function createUser(item) {
  var user = new User(item.id);
  if (item.context) user.context = item.context;

  return user;
}
module.exports = exports['default'];