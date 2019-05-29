const passport = require("passport")

module.exports.auth = passport.authenticate('google', { failureRedirect: '/u/google' })

module.exports.signin = (req, res) => {
    req.login(req.user, (err) => {
		if (err) console.log(err);
		console.log('is authenticated?: ' + req.isAuthenticated());
		req.session['user'] = JSON.stringify(req.user)
		return res.json(req.user)
	})
}

module.exports.currentUser = (req, res, next) => {
    if(req.session['user'])
        req.user = JSON.parse(req.session['user'])
    next()
}