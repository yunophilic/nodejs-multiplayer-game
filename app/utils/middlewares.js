module.exports = {
	isLoggedIn: function (req, res, next) {
		// if user is authenticated in the session, carry on
		if (req.isAuthenticated())
			return next();

		res.format({
			html: function() {
				// if they aren't redirect them to the login page
				res.redirect('/login?next=' + req.originalUrl);
			},
			json: function() {
				res.json({
					status: 403,
					message: 'Must be logged in.'
				});
			}
		});
	}
}
