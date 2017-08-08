// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {
	// =========================================================================
	// passport session setup ==================================================
	// =========================================================================
	// required for persistent login sessions
	// passport needs ability to serialize and unserialize users out of session

	// used to serialize the user for the session
	passport.serializeUser(function(user, done) {
		done(null, user._id); // https://stackoverflow.com/questions/41292348/404-not-found-error-setting-up-passport-in-express-4
	});

	// used to deserialize the user
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	// =========================================================================
	// LOCAL SIGNUP ============================================================
	// =========================================================================
	// we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

	passport.use('local-signup', new LocalStrategy({
		// by default, local strategy uses username and password
		passReqToCallback : true // allows us to pass back the entire request to the callback
	},
	function(req, username, password, done) {
		/*console.log('Pass Captcha');*/
		// asynchronous
		// User.findOne wont fire unless data is sent back
		process.nextTick(function() {
			var email = req.body.email;
			var confirmPassword = req.body.confirmPassword;

			if (username == "" || email == "" || password == "" || confirmPassword == "") {
				return done(null, false, req.flash('signupMessage', 'All fields are required.'));
			}

			if (password != confirmPassword) {
				return done(null, false, req.flash('signupMessage', 'Password and Confirm Password fields do not match.'));
			}

			// find a user whose username/email is the same as the forms username/email
			// we are checking to see if the user trying to login already exists
			User.findOne({ $or: [
				{'local.username': username},
				{'local.email':  email}
			] }, function(err, user) {
				// if there are any errors, return the error
				if (err) {
					return done(err);
				}

				// check to see if theres already a user with that email
				if (user) {
					var usernameTaken = (user.local.username == username);
					var emailTaken = (user.local.email == email);

					if (usernameTaken && emailTaken)
						return done(null, false, req.flash('signupMessage', 'That username and that email is already taken.'));

					if (usernameTaken)
						return done(null, false, req.flash('signupMessage', 'That username is already taken.'));

					if (emailTaken)
						return done(null, false, req.flash('signupMessage', 'That email is already taken.'));

					return done(null, false, req.flash('signupMessage', 'Something wrong (should not go here).'));
				} else {

					// if there is no user with that email
					// create the user
					var newUser = new User();

					// set the user's local credentials
					newUser.local.username = username;
					newUser.local.email	= email;
					newUser.local.password = password;

					// save the user
					newUser.save(function(err) {
						if (err)
							return done(null, false, req.flash('signupMessage', err.message));;
						return done(null, newUser);
					});
				}

			});

		});

	}));

	// =========================================================================
	// LOCAL LOGIN =============================================================
	// =========================================================================
	// we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

	passport.use('local-login', new LocalStrategy({
		// by default, local strategy uses username and password, we will override with email
		usernameField : 'usernameOrEmail',
		passwordField : 'password',
		passReqToCallback : true // allows us to pass back the entire request to the callback
	},
	function(req, usernameOrEmail, password, done) { 
		// callback with usernameOrEmail and password from our form
		// find a user whose username or email is the same as the forms data
		// we are checking to see if the user trying to login already exists
		User.findOne({ $or: [
			{'local.username': usernameOrEmail},
			{'local.email' :  usernameOrEmail.toLowerCase() }
		] }, function(err, user) {
			// if there are any errors, return the error before anything else
			if (err)
				return done(err);

			// if no user is found, return the message
			if (!user)
				return done(null, false, req.flash('loginMessage', 'No user found.'));

			// if the user is found but the password is wrong
			if (!user.validPassword(password))
				return done(null, false, req.flash('loginMessage', 'Wrong password.'));

			// all is well, return successful user
			return done(null, user);
		});

	}));
};
