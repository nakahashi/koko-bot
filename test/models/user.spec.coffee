require 'co-mocha'
chai = require 'chai'
chai.should()

User = require '../../lib/models/user'

describe 'models/user', ->
  users = null
  newid = ''

  after ->
    users = yield User.all()
    for user in users
      yield User.destroy(user.id)

  it '#allは、全ユーザリストを配列で取得します。', ->
    users = yield User.all()
    users.should.be.a 'Array'
    users.length.should.be.a 'Number'

  it '#saveは、ユーザを保存します。', ->
    beforeCount = users.length
    newid = "#{beforeCount+1}"
    user = new User(newid)
    user.context = '123456789'
    yield user.save()

    users = yield User.all()
    users.length.should.equal (beforeCount + 1)

  it '#findは、idがヒットするユーザを取得します。', ->
    user = yield User.find(newid)
    user.id.should.equal newid

  it '#destroyは、idがヒットするユーザを削除します。', ->
    yield User.destroy(newid)

    user = yield User.find(newid)
    user?.should.equal null

    users = yield User.all()
    users.length.should.equal 0
