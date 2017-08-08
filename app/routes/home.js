var express = require('express');
var middlewares = require('../utils/middlewares');
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
				var msg = 'If that email address exists in our database, we have emailed that address with the reset password link.';
				req.flash('success', msg);
				res.redirect('/login');
			}

			var errorResponse = function (err) {
				req.flash('success', err.message);
				res.redirect('/login');
			}

			if (err) {
				return errorResponse(err);
			}

			if (!user) {
				return successResponse(req, res);
			}

			var token = 'dummy';
			mailer.sendMail({
				from: 'Dawn of the Tanks <dott@gmail.com>',
				to: user.local.email,
				subject: 'Reset Password Link',
				text: 'test'
			}, function (err) {
				if (err) {
					// handle error 
					console.log(err);
					res.send('There was an error sending the email');
					return;
				}
				
				//either user found or not display success message
				successResponse(req, res);
			});
		});
	});

	return router;
};

