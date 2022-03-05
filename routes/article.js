var express = require('express');
var router = express.Router();
var model = require('../model');

// 追加、編集
router.post('/add', function(req, res, next) {
  var id = parseInt(req.body.id)
  if (id) {  //編集
    var page = req.body.page
    var title = req.body.title
    var content = req.body.content
    model.connect(function(db) {
      db.collection('articles').updateOne({id: id}, {$set: {
        title: title,
        content: content
      }}, function(err, ret) {
        if (err) {
          console.log('編集失敗', err)
        } else {
          console.log('編集成功')
          res.redirect('/?page='+page)
        }
      })
    })
  } else {   //追加
    var data = {
      title: req.body.title,
      content: req.body.content,
      username: req.session.username,
      id: Date.now()
    }
    model.connect(function(db) {
      db.collection('articles').insertOne(data, function(err, ret) {
        if(err) {
          console.log('失败', err)
          res.redirect('/write')
        } else {
          res.redirect('/')
        }
      })
    })
  }
})

// 記事削除
router.get('/delete', function(req, res, next) {
  var id = parseInt(req.query.id)
  var page = req.query.page
  model.connect(function(db) {
    db.collection('articles').deleteOne({id: id}, function(err, ret) {
      if (err) {
        console.log('削除失敗');
      } else {
        console.log('削除成功');
      }
      res.redirect('/?page='+page);
    })
  })
})





module.exports = router;
