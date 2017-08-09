var express = require('express');
var crypto = require('crypto');
var middlewares = require('../utils/middlewares');
var helpers = require('../utils/helpers');
var router = express.Router();

//models
var User = require('../models/user');

//recaptcha setup
var recaptcha = require('express-recaptcha');
var recaptchaConfig = require('../config/recaptcha');
recaptcha.init(recaptchaConfig.siteKey, recaptchaConfig.secretKey);

//mailer setup
var nodemailer = require('nodemailer');
var mailerConfig = require('../config/mailer');
var mailer = nodemailer.createTransport(mailerConfig);
/*console.log(mailer);*/

module.exports = function(passport) {
	// =====================================
	// HOME PAGE ===========================
	// =====================================
	router.get('/', function(req, res) {
		res.render('home/index'); // load the index.ejs file
	});

	// =====================================
	// HELP PAGE ===========================
	// =====================================
	router.get('/help', function(req, res) {
		res.render('home/help'); // load the help.ejs file
	});

	// =====================================
	// LOCATION PAGE ===========================
	// =====================================
	router.get('/location', function(req, res) {
		res.render('home/location'); // load the help.ejs file
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	router.get('/login', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('home/login', {
			next: req.query.next,
			message: req.flash('loginMessage')
		});
	});

	// process the login form
	router.post('/login', passport.authenticate('local-login', {
		//successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the login page if there is an error
		badRequestMessage: 'All fields are required.',
		failureFlash : { type: 'loginMessage' } // allow flash messages
	}), function(req, res) {
		/*var io = req.app.get('io');
		io.emit('login', req.user.local.username);*/

		var next = req.query.next;
		res.redirect(next ? next : '/profile');
	});

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	router.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('home/signup', { message: req.flash('signupMessage'), captcha:recaptcha.render() });
	});

	// process the signup form
	router.post(
		'/signup',
		function(req, res, next){
			recaptcha.verify(req, function(error){
				if(error){
					//error code
					//res.render('home/signup', { message: req.flash('signupMessage','Invalid Captcha'), captcha:recaptcha.render() });
					req.flash('signupMessage', 'Invalid reCaptcha');
					res.redirect('/signup');
					return;
				}
				return next();
			});
		},
		passport.authenticate('local-signup', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/signup', // redirect back to the signup page if there is an error
			badRequestMessage: 'All fields are required.',
			failureFlash : { type: 'signupMessage' } // allow flash messages
		})
	);


	// =====================================
	// LOGOUT ==============================
	// =====================================
	router.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/login');
	});

	// =====================================
	// FORGOT PASSWORD =====================
	// =====================================
	router.get('/forgot-password', function(req, res) {
		res.render('home/forgot-password');
	});

	//send reset password link
	router.post('/forgot-password', function(req, res, next) {
		var usernameOrEmail = req.body.usernameOrEmail;
		User.findOne({ $or: [
			{'local.username': usernameOrEmail},
			{'local.email' :  usernameOrEmail.toLowerCase() }
		] }, function(err, user) {
			var successResponse = function (req, res) {
				var msg = 'If the specified user exists in our database and the associated email address is valid, we have sent the reset password link to that address.';
				req.flash('success', msg);
				res.redirect('/login');
			}

			var errorResponse = function (err) {
				req.flash('error', err.message);
				res.redirect('/login');
			}

			if (err) {
				return errorResponse(err);
			}

			if (!user) {
				//either user found or not display success message
				return successResponse(req, res);
			}

			//reset password token
			crypto.randomBytes(32, function(err, buf) {
				if (err) {
					//for security reasons don't show why random token generation fails
					//instead just create a generic error message saying that it fails
					var error = new Error();
					error.status = 500;
					error.message = 'Fail to generate reset password token';
					return errorResponse(error);
				}

				//user id used to ensure token uniqeness
				//it's fine to make user id public since
				//it has been public in /users
				var token = buf.toString('base64') + 
					user._id.toString('base64');

				//save reset password token and expiry to db
				user.resetPassword.token = token;
				user.resetPassword.expiry = Date.now() + 3600000;
				user.save(function(err, updatedUser) {
					if(err) {
						return errorResponse(err);
					}

					/*console.log(updatedUser);*/

					var link = 'http://'+ req.get('host') + '/reset-password?token=' + encodeURIComponent(token);
					mailer.sendMail({
						from: 'Dawn of the Tanks <cmpt470.summer2017@gmail.com>',
						to: user.local.email,
						subject: 'Reset Password Link',
						text: 'You are receiving this email because you (or someone else) have requested to reset your password.\n\n' +
							'Click on the following link, or paste it into your browser to complete the process:\n\n' +
							'Reset password link: ' + link + '\n\n' +
							'If you did not request this, please ignore this email and your password will remain unchanged.\n\n'
					}, function (err) {
						if (err) {
							return errorResponse(err);
						}

						successResponse(req, res);
					});
				});
			});
		});
	});

	router.get('/reset-password', function(req, res) {
		var token = req.query.token;
		
		if (!token) {
			req.flash('error', 'Token invalid or expired.');
			res.redirect('/login');
			return;
		}

		User.findOne({
			'resetPassword.token': token,
			'resetPassword.expiry': { $gt: Date.now() }
		}, function(err, user) {
			if (err) {
				req.flash('error', err.message);
				res.redirect('/login');
				return;
			}

			if(!user) {
				req.flash('error', 'Token invalid or expired.');
				res.redirect('/login');
				return;
			}

			req.session['token'] = helpers.encrypt(user.resetPassword.token);
			res.render('home/reset-password');
		});
	});

	router.post('/reset-password', function(req, res) {
		var tokenEncr = req.session['token'];
		if(!tokenEncr) {
			req.flash('error', 'Session expired. Please retry.');
			res.redirect('back');
			return;
		}

		var token = helpers.decrypt(tokenEncr);

		User.findOne({
			'resetPassword.token': token,
			'resetPassword.expiry': { $gt: Date.now() }
		}, function(err, user) {
			if (err) {
				req.flash('error', err.message);
				res.redirect('/login');
				return;
			}

			if(!user) {
				req.flash('error', 'Token invalid or expired.');
				res.redirect('/login');
				return;
			}

			var newPassword = req.body.newPassword;
			var confirmPassword = req.body.confirmPassword;
			
			if (newPassword == '') {
				req.flash('error', 'New password cannot be empty.');
				return res.redirect('/profile');
			}

			if (newPassword != confirmPassword) {
				req.flash('error', 'New password and confirm password do not match.');
				return res.redirect('/profile');
			}

			//change pwd and clear reset password token and expiry on db
			user.local.password = newPassword;
			user.resetPassword.token = null;
			user.resetPassword.expiry = null;

			user.save(function(err) {
				if(err) {
					req.flash('error', err.message);
					res.redirect('back');
					return;
				}

				req.flash('success', 'Your password has been changed.');
				res.redirect('/login');
			});
		});
	});

	return router;
};

