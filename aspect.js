const BaseAspect = require("../framework/src/base_aspect.js")
const loader = require("../framework/src/loader.js")
const express = require("express")
const path = require('path');
const users = require("../users/aspect.js")
var exphbs  = require('express-handlebars');
const {auth, currentUser} = require("../users/shortcuts.js")
const router = express.Router()

router.get("/handlebars", (req, res) =>{
    res.header('Content-Type', 'text/javascript')
    res.sendFile(path.join(app_root+"/node_modules/handlebars/dist/handlebars.runtime.js"));
})

router.get("/", currentUser, (req,res) => {
    console.log(req.user)
    if(req.user)
        return res.render("index", {user:req.user})
    res.render("login")
});

router.get("/login", loader.expectsAspect("BitwaspAirBnB_Users"), (req, res) =>{
    res.render("login", {google_id : req.BitwaspAirBnB_Users.secrets.GOOGLE_CLIENT_ID})
})

module.exports = class UI extends BaseAspect{
    static AspectAuthor(){return "wgourley"}
    static AspectName(){return "BitwaspAirBnB_UI"}
    constructor(app){
        super(app)
        app.use('/static', express.static('assets'))
        app.engine('handlebars', exphbs({defaultLayout: 'main'}));
        app.set('view engine', 'handlebars');
    }
    
    register_routes(app){
        app.use("/", router)
    }
}