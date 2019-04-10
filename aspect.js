var MongoClient = require('mongodb').MongoClient;
const BaseAspect = require("../framework/src/base_aspect.js")

module.exports = class Database extends BaseAspect{
    static AspectAuthor(){return "amokgohl"}
    static AspectName(){return "BitWaspAirnBnb-database"}
    constructor(app){
        super(app)
        module = this
        uri = process.env.SRV
        MongoClient.connect(uri, { useNewUrlParser: true } ,function(err, client) {
           module.connection = client.db("air_db")
        })
        console.log("database connected")
    }
}
