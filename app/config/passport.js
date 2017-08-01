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
		console.log("username and password ok");

		// asynchronous
		// User.findOne wont fire unless data is sent back
		process.nextTick(function() {
			var email = req.body.email;

			if (username == "" || email == "" || password == "") {
				return done(null, false, req.flash('signupMessage', 'All fields are required'));
			}

			// find a user whose email is the same as the forms email
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
					return done(null, false, req.flash('signupMessage', 'That username or email is already taken.'));
				} else {

					// if there is no user with that email
					// create the user
					var newUser = new User();

					// set the user's local credentials
					newUser.local.username = username;
					newUser.local.email	= email;
					newUser.local.password = newUser.generateHash(password);
					newUser.local.imgPath = 'profile4.png';

					// save the user
					newUser.save(function(err) {
						if (err)
							throw err;
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
	function(req, usernameOrEmail, password, done) { // callback with email and password from our form
		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
		User.findOne({ $or: [
			{'local.username': usernameOrEmail},
			{'local.email' :  usernameOrEmail}
		] }, function(err, user) {
			// if there are any errors, return the error before anything else
			if (err)
				return done(err);

			// if no user is found, return the message
			if (!user)
				return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

			// if the user is found but the password is wrong
			if (!user.validPassword(password))
				return done(null, false, req.flash('loginMessage', 'Wrong password.')); // create the loginMessage and save it to session as flashdata

			// all is well, return successful user
			return done(null, user);
		});

	}));
};

/*
update UserName
*/
passport.use('local-updateUserName', new LocalStrategy({
	passReqToCallback : true // allows us to pass back the entire request to the callback
},
function(req, done) {
	// asynchronous
	// User.findOne wont fire unless data is sent back
	process.nextTick(function() {
		var username = req.body.username;
		username = encodeURI(username);
		var userid = req.user._id;
		if (username == "") {
			return done(null, false, req.flash('ErrMsg', 'All fields are required'));
		}

		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
		User.findOne({ $or: [
			{'local.username': username}
		] }, function(err, user) {
			// if there are any errors, return the error
			if (err) {
				return done(err);
			}

			// check to see if theres already a user with that email
			if (user) {
				return done(null, false, req.flash('ErrMsg', 'That username is already taken.'));
			} else {

					User.findOne({_id: userid}, function (err, foundObject){
						if (err){
							return done(null, false, req.flash('ErrMsg', 'Error while finding current user'));
						} else {
							if (!foundObject){
								return done(null, false, req.flash('ErrMsg', 'Cannot find current user'));
							}else{
								foundObject.local.username = username;
							}
							foundObject.save(function (err,updatedObejct){
								if (err){
									return done(null, false, req.flash('ErrMsg', 'Error while updating current user'));
								}else{
									return done(null, updatedObejct);
								}
							});
						}
					});

			}

		});

	});

}));
