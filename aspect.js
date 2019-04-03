const BaseAspect = require("../framework/src/base_aspect.js")
const express = require("express")
const path = require('path');
var exphbs  = require('express-handlebars');

const router = express.Router()

router.get("/handlebars", (req, res) =>{
    res.header('Content-Type', 'text/javascript')
    res.sendFile(path.join(app_root+"/node_modules/handlebars/dist/handlebars.runtime.js"));
})

router.get("/", (req,res) => {
    res.render("index")
  });

module.exports = class UI extends BaseAspect{
    static AspectAuthor(){return "wgourley"}
    static AspectName(){return "BitwaspAirBnB_UI"}
    constructor(app){
        super(app)
        app.use('/static', express.static('static'))
        app.engine('handlebars', exphbs({defaultLayout: 'main'}));
        app.set('view engine', 'handlebars');
        app.use("/", router)
    }
}