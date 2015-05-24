var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var mongodb = require('mongodb');
var app = express();
var request = require('request');
var url = 'mongodb://localhost:27017/favoriteweb';
var db = null;
var fevoriteweb = require('./model/fevoriteweb.js');
var ImageResolver= require('image-resolver');
var resolver = new ImageResolver();

MongoClient.connect(url, function(err, _db) {
  if(err){
    console.log('Connection Error');
  }
  else{
    console.log("Connected correctly to server");
    db = _db;
  }
});


app.get('/api/adduser', function (req, res) {
 
  var data = {
    name:req.query.name,
    id:req.query.id

  }

  fevoriteweb.insertUser(db, data, 
    function(result){
      res.send(result);
    },
    function(err){
      res.status(500).send(err);
    }
  );
});

app.get('/api/addfavorite', function (req, res) {
 
  var getData = JSON.parse(req.query.data)
  var data = {
    'favorite_name':getData.name,
    'favorite_link':getData.link,
    'favorite_status':getData.status,
    'favorite_img':'/img/thumbnail-default.jpg',
    'user_id':getData.userId
  };

  pullImg(data.favorite_link,function( result ){
    if (result)
    {
      data.favorite_img = result.image;
      fevoriteweb.insertfavorite(db, data, 
        function(result){
          res.send(result);
        },
        function(err){
          res.status(500).send(err);
        }
      );  
     
    }
    else {
      fevoriteweb.insertfavorite(db, data, 
        function(result){
          res.send(result);
        },
        function(err){
          res.status(500).send(err);
        }
      ); 
    }

  })
    
});


app.get('/api/favorite', function (req, res) {

  var data = {
      user_id:req.query.userId,
  };
  var padding = {
      page:req.query.page,
      pageCount:10,
      key:undefined
  };
  padding.skip = (padding.pageCount*(padding.page-1));

  if(req.query.status != undefined)
  {
    data.favorite_status = req.query.status;

  }


  if(req.query.key != undefined)
  {
    padding.key = req.query.key;
  }
  fevoriteweb.countFavorite(db, data, 
    function(count){
      var page = Math.ceil(count/padding.pageCount);
      fevoriteweb.getFavorite(db, padding, data, 
        function(result){
          var data = {
            page:page,
            data:result
          };
          res.send(data);
        },
        function(err){
          res.status(500).send(err);
        }
      );
    },
    function(err){
      res.status(500).send(err);
    }
  );

});

app.get('/api/delete', function (req, res) {
  var id = req.query.id;
  fevoriteweb.deleteDocuments(db, mongodb, id, 
    function(result){
      res.send(result);
    },
    function(err){
      res.status(500).send(err);
    }
  );
});




function pullImg(link,callback)
{
  resolver.register(new ImageResolver.FileExtension());
  resolver.register(new ImageResolver.MimeType());
  resolver.register(new ImageResolver.Opengraph());
  resolver.register(new ImageResolver.Webpage());
  resolver.resolve(link,callback);
};


////////////////////////////////////////////////////////////////////////
app.use(express.static('public'));
app.listen(8080);


