var express = require('express');
var middlewares = require('../utils/middlewares');
var mongoose = require('mongoose'); //mongo connection
var router = express.Router();
var recaptcha = require('express-recaptcha');

recaptcha.init('6LcI_isUAAAAACY6t0i1eOmDRv0M9cX_LTYohj8-', '6LcI_isUAAAAAA7kPI3vNH3IsvjHNTVPR1wDRei6');
//var bodyParser = require('body-parser'); //parses information from POST
//var methodOverride = require('method-override'); //used to manipulate POST

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
	router.post('/signup', function(req, res){
    recaptcha.verify(req, function(error){
        if(!error){
            //success code
						console.log('Pass Captcha');
						passport.authenticate('local-signup', {
						successRedirect : '/profile', // redirect to the secure profile section
						failureRedirect : '/signup', // redirect back to the signup page if there is an error
						badRequestMessage: 'All fields are required.',
						failureFlash : { type: 'signupMessage' } // allow flash messages
					});
        }else{
            //error code
						console.log('Invalid Captcha');
						res.redirect('/signup');
    }})
	});


	// =====================================
	// LOGOUT ==============================
	// =====================================
	router.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/login');
	});

	return router;
};
