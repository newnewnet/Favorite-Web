module.exports = {
  insertUser:function (db, data, success, error) {
    var collection = db.collection('user');
    collection.insert(data, function(err, result) {
      if(err){
        error(err);
      }else{
        success(result);
      }
    });
  },
  insertfavorite:function (db, data, success, error) {
    var collection = db.collection('favorite');
    collection.insert(data, function(err, result) {
      if(err){
        error(err);
      }else{
        success(result);
      }
    });
  },
  getFavorite:function (db, padding, data, success, error) {
    var collection = db.collection('favorite');
    if(padding.key != undefined)
    {
      console.log(padding.key);
      collection.find({"favorite_name": { $regex: padding.key }}).sort( { _id: -1 } ).skip(padding.skip).limit(padding.pageCount).toArray(function(err, result) {
        if(err){
          error(err);
        }else{
          console.log("sdfdsf");
          success(result);

        }
      });
    }
    else 
    {
      collection.find(data).sort( { _id: -1 } ).skip(padding.skip).limit(padding.pageCount).toArray(function(err, result) {
        if(err){
          error(err);
        }else{
          success(result);
        }
      });
    }
  },
  countFavorite:function (db, data, success, error) {
    var collection = db.collection('favorite');
    collection.find(data).count(function(err, result) {
      if(err){
        error(err);
      }else{
        success(result);
      }
    });
  },
  deleteDocuments:function (db, mongodb, id, success, error) {
    var collection = db.collection('favorite');
     collection.remove( {"_id": new mongodb.ObjectId(id)},function(err, result) {
      if(err){
        error(err);
      }else{
        success(result);
      }
    });
  }

}