const passport = require("passport")

module.exports.auth = passport.authenticate('google', { failureRedirect: '/u/google' })

module.exports.signin = (req, res, next) => {
    req.login(req.user, (err) => {
		if (err) console.log(err);
		console.log('is authenticated?: ' + req.isAuthenticated());
		req.session['user'] = JSON.stringify(req.user)
		next()
	})
}

module.exports.currentUser = (req, res, next) => {
    if(req.session['user'])
        req.user = JSON.parse(req.session['user'])
    next()
}