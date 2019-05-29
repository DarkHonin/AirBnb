const BaseAspect = require("../framework/src/base_aspect.js")
const endpoints = require("./router.js")

module.exports = class Database extends BaseAspect{
    static AspectAuthor(){return "amokgohl"}
    static AspectName(){return "BitWaspAirnBnb_database"}
    constructor(app){
        super(app)
        app.use("/listings", endpoints)
        this.Listings = require('./app/models/listing')
        this.Bookings = require('./app/models/booking')
        console.log("loaded Database")
    }
}