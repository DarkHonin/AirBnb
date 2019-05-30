const BaseAspect = require("../framework/src/base_aspect.js")
const loader = require("../framework/src/loader.js")
const express = require("express")
const fs = require("fs")
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require("passport")
const {serializeUser, deserializeUser, findOrCreateUser} = require("./serializeing.js")
const User = require("./user.js")
const router = express.Router()
const {auth, signin, currentUser} = require("./shortcuts.js")
var session = require('express-session');
const uuid = require('uuid/v4')

const parser = (req, res, next) => {
	if (req.method === 'POST') {
	  let body = '';
	  req.on('data', chunk => {
		  body += chunk.toString();
	  });
	  req.on("end", () => {
		try{
			req['json'] = JSON.parse(body)
		} catch(SyntaxError){
			console.warn("failed to parse incoming json")
		}
		next()
	  })
  }
  }

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', auth, signin, (req, res) => {res.redirect("/")});

router.get('/logout', (req, res)=>{
	req.logout();
	res.json({status:true, data:"You are now logged out"})
})

router.get('/', currentUser, (req, res) => {
	return res.json(req.user)
})

router.post('/set_accout_type', parser, currentUser, (req, res) => {
	if(!req.user)
		return res.json({status: false, reason: "You need to be logged in to edit your account"})
	if(!req.json['set'])
		return res.json({status: false, reason: "Expected property 'set' of value '1' or '0'"})
	if(isNaN(req.json['set']))
		return res.json({status: false, reason: "Expected number got something else"})
	val = parseInt(req.json['set'])
	console.log("Current acount type: ",req.user.accountType)
	console.log(val)
	req.user.accountType = val
	req.user.save()
	console.log("New acount type: ",req.user.accountType)
	return res.json({status: true})
})

module.exports = class UI extends BaseAspect{
	static AspectAuthor(){return "wgourley"}
	static AspectName(){return "BitwaspAirBnB_Users"}
	constructor(app){
		super(app)
		app.use(passport.initialize());
		app.use(passport.session());
		app.use(session({
			genid: (req) => { return uuid() },
			secret: 'keyboard cat',
			resave: false,
			saveUninitialized: true,
			expires: new Date(Date.now() + (30 * 86400 * 1000))
		}))
		this.load_secrets()
	}

	register_routes(app){
		app.use("/u", router)
	}
	
	load_secrets(){
		var data = fs.readFileSync(`${__dirname}/secrets.json`,{encoding: 'utf-8'})
		var secrets = JSON.parse(data)
		this.init_passport(secrets)
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