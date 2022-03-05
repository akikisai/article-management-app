var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/textapp';
var dbName = 'textapp';

//データベースへ接続用
function connect(callback) {
  MongoClient.connect(url, function(err, client) {
    if (err) {
      console.log('データベース接続エラー', err);
    } else {
      var db = client.db(dbName);
      callback && callback(db);
    }
  });
}


module.exports = {
  connect
}
