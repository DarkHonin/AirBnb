// var MongoClient = require('mongodb').MongoClient, assert = require('assert');

// // Connection URL
// var url = 'mongodb+srv://allie:Moknare95@airbnb-ttiyl.mongodb.net/test?retryWrites=true'
// MongoClient.connect(url,{ useNewUrlParser: true });
// // Use connect method to connect to the Server
// MongoClient.connect(url, function(err, db) {
//   useNewUrlParser: true;
//   assert.equal(null, err);
//   console.log("Connected correctly to server");

//   db.close();
// });

// var MongoClient = require('mongodb').MongoClient
// MongoClient.mongoConnect = () => {
//   mongoose.Promise = global.Promise
//   mongoose.connect('mongodb+srv://allie:Moknare95@airbnb-ttiyl.mongodb.net/test?retryWrites=true', {useNewUrlParser: true})
//   .then(() => {
//   console.log('mongoDB is connected...')
//   })
//   .catch((err) => {
//   throw err
//   })
//   }

// var MongoClient = require('mongodb').MongoClient,format = require('util').format;

// MongoClient.connect('', { useNewUrlParser: true }, function(err,db){
//   if(err){
//     throw err;
//   } else{
//     console.log("Good");
//   }
//   db.close();
// })

// const mongoose = require("mongoose");
// mongoose.Promise = Promise;
// const session = require('express-session');
// const MongoStore = require('connect-mongo')(session);

// mongoose.connect('mongodb://localhost/air_db');

// app.use(session({
//     secret: "",
//     store: new MongoStore({ mongooseConnection: mongoose.connection })
// }));



//connecting to the cloud a client
var MongoClient = require('mongodb').MongoClient;
//connection usin url of the client at the cluster
var uri = "mongodb+srv://allie:Moknare95@airbnb-ttiyl.mongodb.net/test?retryWrites=true";
MongoClient.connect(uri, { useNewUrlParser: true } ,function(err, client) {
   const collection = client.db("air_db").collection("devices");
   // perform actions on the collection object
   client.close();
});
