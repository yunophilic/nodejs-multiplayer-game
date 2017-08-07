var recaptcha = require('express-recaptcha');
//shold remove key from code
recaptcha.init('6LcI_isUAAAAACY6t0i1eOmDRv0M9cX_LTYohj8-', '6LcI_isUAAAAAA7kPI3vNH3IsvjHNTVPR1wDRei6');

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
				res.status = 403;
				res.json({
					status: 403,
					message: 'Must be logged in.'
				});
			}
		});
	}

	hasRecaptcha: function (req, res, next) {
		// if user is pass recaptcha in the session, carry on
		recaptcha.verify(req, function(error){
			 if(!error){
					 return next();
			 }else{
				 res.format({
		 			html: function() {
		 				// if they aren't redirect them to the login page
		 				res.redirect(req.originalUrl);
		 			},
		 			json: function() {
		 				res.status = 403;
		 				res.json({
		 					status: 403,
		 					message: 'Must be pass recaptcha.'
		 				});
		 			}
		 		});
			 }
	 });
	}
}
