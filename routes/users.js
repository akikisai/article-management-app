var express = require('express');
var router = express.Router();
var model = require('../model');
/* GET users listing. */
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 登録
router.post('/regist', function(req, res, next) {
  var data = {
    username: req.body.username,
    password: req.body.password
  };


  // データの接続
  model.connect(function(db) {
    //コレクションusersにデータ挿入する
    db.collection('users').insertOne(data, function(err, ret) {
      //登録失敗
      if (err) {
        console.log('登録失敗');
        res.redirect('/regist');
      } else {
        //登録成功、ログインページへ
        res.redirect('/login');
      }
    });
  })
})

// ログイン
router.post('/login', function(req, res, next) {
  var data = {
    username: req.body.username,
    password: req.body.password
  }

  //データベースに接続する。
  model.connect(function(db) {
    //コレクションに同じデータがあるか、あればログイン成功。
    db.collection('users').find(data).toArray(function(err, docs) {
      if (err) {
        res.redirect('/login');
      }else {
        if (docs.length > 0) {
          // ログイン成功　session保存
          req.session.username = data.username;//ユーザーネームをセッションに保存
          res.redirect('/');
        } else {
          res.redirect('/login');
        }
      }
    })
  })
})


//ログアウト
router.get('/logout',function(req,res,next){
  req.session.username = null;
  res.redirect('/login');
})



module.exports = router;
