var express = require('express');
// var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var app = express();
var request = require('request');

 
// scrape('http://news.ycombinator.com', '.title a', function (error, matches) {

// // console.log(matches);

// // data = JSON.pare(matches);
// // console.log(data);
// // // res.send(data);

// });



var ImageResolver= require('image-resolver')
var resolver = new ImageResolver();
resolver.register(new ImageResolver.FileExtension());
resolver.register(new ImageResolver.MimeType());
resolver.register(new ImageResolver.Opengraph());
resolver.register(new ImageResolver.Webpage());

resolver.resolve("http://codepen.io/", function( result ){
    if ( result ) {
        console.log( result.image );
    } else {
        console.log( "No image found" );
    }
});


////////////////////////////////////////////////////////////////////////
app.use(express.static('public'));
app.listen(8080);


