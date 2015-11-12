import AWS from 'aws-sdk';
import DOC from 'dynamodb-doc'
import 'babel/polyfill';

const TABLENAME = 'users';
const db = new AWS.DynamoDB({ region: 'ap-northeast-1' });
const doc = new DOC.DynamoDB(db);

/**
 * AWSのDynamoDBに格納するユーザ情報のモデルです。
 */
export default class User {
  /**
   * @param {string} id - ユーザID
   */
  constructor(id) {
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
  save() {
    return new Promise((resolve, reject) => {
      let params = {};
      params.TableName = TABLENAME;
      params.Item = { 'id': this.id, 'context': this.context };

      doc.putItem(params, (err) => {
        if (err) { reject(err) }
        else { resolve() }
      });
    });
  }

  /**
   * 全てのユーザ情報を取得します。
   * @returns {Promise<User[], Error>} ユーザ情報配列
   */
  static all() {
    return new Promise((resolve, reject) => {
      let params = {};
      params.TableName = TABLENAME;
      params.Select = 'ALL_ATTRIBUTES';

      doc.scan(params, (err, res) => {
        if (err) { reject(err) }

        let users = [];
        if (res.Count > 0) {
          users = res.Items.map((item) => { return createUser(item) });
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
  static find(id) {
    return new Promise((resolve, reject) => {
      let params = {};
      params.TableName = TABLENAME;
      params.Key = {id};

      doc.getItem(params, (err, data) => {
        if (err) { reject(err) }

        let user = data.Item ? createUser(data.Item) : null;
        resolve(user);
      });
    });
  }

  /**
   * ユーザ情報を破棄します。
   * @param {string} id - ユーザID
   * @returns {Promise<Error>}
   */
  static destroy(id) {
    return new Promise((resolve, reject) => {
      User.find(id).then(user => {
        let params = {};
        params.TableName = TABLENAME;
        params.Key = {id};

        doc.deleteItem(params, (err) => {
          if (err) { reject(err) }
          else { resolve() }
        });
      }).catch(err => {
        reject(err);
      });
    });
  }
}

function createUser(item) {
  let user = new User(item.id);
  if (item.context) user.context = item.context;

  return user;
}
