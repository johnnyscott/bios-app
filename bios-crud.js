var mongojs = require('mongojs');
var biosDb = mongojs('bios');
var biosDocs = biosDb.collection('bios');


var getAll = function(callback){
  biosDocs.find({}).toArray(function(err, docs) {
    console.log('bios-crud.getAll');
    console.log(err);
    console.log(JSON.stringify(docs, null, 2));
    callback(err, docs);
  });
};

exports.getAll = getAll;
//biosDocs.findOne({ _id:mongojs.ObjectId('5556e4e9696e677a1b5a2881')}, function (err, doc){
//  console.log(err);
//  console.log(JSON.stringify(doc, null, 2));
//});


/*var MongoClient = require('mongodb').MongoClient,
    connectionReady = false,
    oLog = function (o){
      console.log('o: ' + JSON.stringify(o, null, 2));
    },
    errLog = function (err){
      console.log('err: ' + JSON.stringify(err, null, 2));
    };


MongoClient.connect('mongodb://localhost:27017/bios', function(err, db){
  if(err === null){
    connectionReady = true;

    db.collection('bios', function (err, collection){
      if(err === null){

        oLog(collection);
      }else{
        oLog(collection);
        errLog(err);
      }
    });

  }else{
    errLog(err);
  }
});

var getAllBios = function(){
  if(connectionReady){
    console.log('try to get');
    return {};
  }else{
    console.log('getAllBios: connection not ready!');
  }
};

exports.getBios = getAllBios;
*/
