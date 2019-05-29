const User = require("./user.js")

module.exports.serializeUser = (user, done) => {
	console.log("Serializing user")
	done(null, user.id)
}

module.exports.deserializeUser = (id, done)=>{
	console.log("deSerializing user")
	User.where({id:id}, function(err, user) {
		done(err, user);
	});
}

module.exports.findOrCreateUser = (profile, callback) => {
	console.log("Trying for user: ", profile.id)
	User.findOne({id : profile.id}).exec((err, found_user) => {
		if (!found_user){
			new_user = new User({id:profile.id, email:profile.emails[0], displayName:profile.displayName})
			new_user.save()
			callback(err, new_user)
			console.log("created user")
			return
		}else{
			console.log("User found")
			callback(null, found_user)
		}
	})
	
}