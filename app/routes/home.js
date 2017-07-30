var express = require('express');
var middlewares = require('../utils/middlewares');
var router = express.Router();

module.exports = function(passport) {
	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	router.get('/', function(req, res) {
		res.render('home/index'); // load the index.ejs file
	});
	router.get('/help', function(req, res) {
		res.render('home/help'); // load the help.ejs file
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	router.get('/login', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('home/login', { message: req.flash('loginMessage') });
	});

	// process the login form
	router.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the login page if there is an error
		badRequestMessage: 'All fields are required.',
		failureFlash : { type: 'loginMessage' } // allow flash messages
	}));

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	router.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('home/signup', { message: req.flash('signupMessage') });
	});

	// process the signup form
	router.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		badRequestMessage: 'All fields are required.',
		failureFlash : { type: 'signupMessage' } // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =====================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	router.get('/profile', middlewares.isLoggedIn, function(req, res) {
		res.render('home/profile', {
			user : req.user // get the user out of session and pass to template
			//image: 'profile1.png'
		});
	});
/*
	router.post('/profile/upload', middlewares.isLoggedIn, function(req, res) {


		var data = fs.readFileSync(imgPath);
		var type = 'image/png';
		mongoose.model('User').findById(req.id, function (err, user) {
			if (err) {
				console.log('GET Error: There was a problem retrieving: ' + err);
			} else {
				//update img values
				user.update({
					_id:req.id
				},{
					img.data: data,
					img.contentType:type
				})

			}
		})

	});
*/
	// =====================================
	// LOGOUT ==============================
	// =====================================
	router.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/login');
	});

	return router;
};
