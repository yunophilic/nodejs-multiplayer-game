var express = require('express');
var middlewares = require('../utils/middlewares');
var mongoose = require('mongoose'); //mongo connection
var router = express.Router();
var bodyParser = require('body-parser'); //parses information from POST
var methodOverride = require('method-override'); //used to manipulate POST

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
		});
	});
	router.get('/profile/edit', middlewares.isLoggedIn, function(req, res) {
		res.render('home/editprofile', {
			user : req.user // get the user out of session and pass to template
		});
	});

router.post('/profile/edit', function(req, res) {
		//var userid = req.body.userid;
		var userid = req.user._id;
		var img_req = req.body.profilePic;
		var token = req.body._csrf;
		var img;

switch(img_req) {
  case '1':
		img = "profile1.png";
        break;
	case '2':
		img = "profile2.png";
        break;
	case '3':
		img = "profile3.png";
        break;
	case '4':
		img = "profile4.png";
        break;
    default:
	   img = "profile4.png";
}

	mongoose.model('User').findOne({_id: userid}, function (err, foundObject){
		if (err){
			res.status(500).send();
		} else {
			if (!foundObject){
				res.status(404).send();
			}else{
				foundObject.local.imgPath = img;
			}
			foundObject.save(function (err,updatedObejct){
				if (err){
					res.status(500).send();
				}else{
					//res.send(updatedObejct);
					res.redirect('/profile/');
				}
			});
		}
	});
});

/*
Update username
*/

router.post('/profile/editusername', passport.authenticate('local-updateUserName', {
	
}));

	// =====================================
	// LOGOUT ==============================
	// =====================================
	router.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/login');
	});

	return router;
};
