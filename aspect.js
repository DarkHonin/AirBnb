const BaseAspect = require("../framework/src/base_aspect.js")
const loader = require("../framework/src/loader.js")
const express = require("express")
const fs = require("fs")
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require("passport")
const {serializeUser, deserializeUser, findOrCreateUser} = require("./serializeing.js")
const User = require("./user.js")
const router = express.Router()

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/u/google' }), (req, res) => {
	console.log(req.user)
	res.redirect("/")
});

router.get("/", passport.authenticate('google', { failureRedirect: '/u/google' }), loader.expectsAspect("BitwaspAirBnB_Users"), (req, res) => {
	console.log(req.user)
	res.render("profile", {user: req.user})
})

module.exports = class UI extends BaseAspect{
    static AspectAuthor(){return "wgourley"}
    static AspectName(){return "BitwaspAirBnB_Users"}
    constructor(app){
		super(app)
		app.use(passport.initialize());
		app.use(passport.session());
		app.use("/u", router)
		this.load_secrets()
	}
	
	load_secrets(){
		fs.readFile(`${__dirname}/secrets.json`,{encoding: 'utf-8'}, (err, data)=>{
			var secrets = JSON.parse(data)
			this.init_passport(secrets)
		})
	}

	init_passport({GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET}){
		passport.use(new GoogleStrategy({
			clientID: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			callbackURL: `http://localhost:5000/u/google/callback`
		  },
		  function(accessToken, refreshToken, profile, cb) {
			findOrCreateUser(profile, (err, user) => cb(err, user))
		  }
		));
		passport.serializeUser(serializeUser);
		passport.deserializeUser(deserializeUser);
		console.log("Passport configured")
	}
}