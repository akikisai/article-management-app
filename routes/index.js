var express = require('express');
var router = express.Router();
var model = require('../model');
var moment = require('moment');

/* ホームページ*/
router.get('/', function(req, res, next) {
  var username = req.session.username;
  //フロント側で今は何ページ目にいるかデータを受け取る、なければ1
  var page = req.query.page || 1;
  var data = {
    total: 0,//トータル何ページ必要か
    curPage: page,//現在あるページ数
    list:[]//今表示しているページの記事リスト
  }
  var pageSize = 2;//表示しているページに記事何個ひょうじするか

  model.connect(function(db) {
    // すべての記事を調べる。
    db.collection('articles').find().toArray(function(err, docs) {
      //全部の記事数÷1ぺ時に表示する記事数＝トータル何ページ必要か
      //Math.ceil() 関数は、引数として与えた数以上の最小の整数を返す
      data.total = Math.ceil(docs.length / pageSize)
      // 今のページの記事リストを調べる。
      model.connect(function(db) {
        // sort()  limit()  skip()
        //降順で、一回に調べる記事数を限定（2）、スキップする個数（1ページ目なら(1-1)*2で0,スキップせず最初から2つ調べる）
        db.collection('articles').find().sort({_id: -1}).limit(pageSize).skip((page-1)*pageSize).toArray(function(err, docs2) {
           if (docs2.length == 0) {
             //前のページに戻る、最小1
             res.redirect('/?page='+((page-1) || 1))
           } else {
            docs2.map(function(ele, index) {
              ele['time'] = moment(ele.id).format('YYYY-MM-DD HH:mm:ss')
            })
            data.list = docs2
           }
          res.render('index', { username: username, data: data });
        })
      })
    })
  })

});


// 登録ページ
router.get('/regist', function(req, res, next) {
  res.render('regist', {})
});

// ログインページ
router.get('/login', function(req, res, next) {
  res.render('login', {})
});

// 投稿＆編集ページ
router.get('/write', function(req, res, next) {
  var username = req.session.username || ''
  var id = parseInt(req.query.id)
  var page = req.query.page
  var item = {
    title: '',
    content: ''
  }
  if (id) {  // 編集
    model.connect(function(db) {
      db.collection('articles').findOne({id: id} , function(err, docs) {
        if (err) {
          console.log('失败')
        } else {
          item = docs
          item['page'] = page
          res.render('write', {username: username, item: item})
        }
      })
    })
  } else {  // 追加
    res.render('write', {username: username, item: item})
  }
})

// 記事詳細ページ
router.get('/detail', function(req, res, next) {
  var id = parseInt(req.query.id)
  var username = req.session.username || ''
  model.connect(function(db) {
    db.collection('articles').findOne({id: id}, function(err, docs) {
      if (err) {
        console.log('失败', err)
      } else {
        var item = docs
        item['time'] = moment(item.id).format('YYYY-MM-DD HH:mm:ss')
        res.render('detail', {item: item, username: username})
      }
    })
  })
})


module.exports = router;
