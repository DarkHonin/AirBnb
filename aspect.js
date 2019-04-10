var MongoClient = require('mongodb').MongoClient;
const BaseAspect = require("../framework/src/base_aspect.js")

module.exports = class Database extends BaseAspect{
    static AspectAuthor(){return "amokgohl"}
    static AspectName(){return "BitWaspAirnBnb-database"}
    constructor(app){
        super(app)
        var mod = this
        var uri = process.env.SRV
        MongoClient.connect(uri, { useNewUrlParser: true } ,function(err, client) {
            if(err){
                throw err
            }
           mod.connection = client.db("air_db")
        })
        console.log("database connected")
    }
}
