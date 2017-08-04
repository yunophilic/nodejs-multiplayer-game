var express = require('express');
var mongoose = require('mongoose');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var helpers = require('../utils/helpers');
var middlewares = require('../utils/middlewares');
var router = express.Router();

//models
var User = require('../models/user');

//constants
const AVATAR_DIR = './public/img/avatar';
const ALLOWED_AVATAR_FORMAT = ['.jpg', '.png'];

// =====================================
// PROFILE SECTION =====================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)

router.get('/', middlewares.isLoggedIn, function(req, res) {
	var avatarName = null

	if (fs.existsSync(AVATAR_DIR)) {
		fs.readdirSync(AVATAR_DIR).forEach(function(x) {
			if (x.startsWith(req.user._id.toString())) {
				avatarName = x;
			}
		});
	}

	var imgPath = avatarName != null ?
		path.join('/img/avatar', avatarName) :
		'/img/default-avatar.jpg';

	res.render('profile/index', {
		user : req.user,
		imgPath: imgPath
	});
});

router.get('/username', middlewares.isLoggedIn, function(req, res) {
	console.log('HEY');
	res.json({username: req.user.local.username});
});

router.get('/friend-requests', middlewares.isLoggedIn, function(req, res) {
	res.format({
		html: function() {
			res.render('profile/friend-requests', {
				title : "Friend Requests",
				layout: 'layouts/angular'
			});
		},
		json: function() {
			User.find({ _id: { $in: req.user.friendRequests } }, function(err, users) {
				if (err) {
					return console.error(err);
				} else {
					res.json(users);
				}
			});
		}
	});
});


router.get('/friend-requests-num', middlewares.isLoggedIn, function(req, res) {
	res.format({
		json: function() {
			res.json(req.user.friendRequests.length);
		}
	});
});


router.get('/friends', middlewares.isLoggedIn, function(req, res) {
	res.format({
		html: function() {
			res.render('profile/friends', {
				title : "Friends",
				layout: 'layouts/angular'
			});
		},
		json: function() {
			console.log(req.user.friends);
			User.find({ _id: { $in: req.user.friends } }, function(err, users) {
				if (err) {
					return console.error(err);
				} else {
					console.log(users);
					res.json(users);
				}
			});
		}
	});
});

/*router.get('/edit', middlewares.isLoggedIn, function(req, res) {
	res.render('profile/edit', {
		user : req.user // get the user out of session and pass to template
	});
});

router.post('/edit', middlewares.isLoggedIn, function(req, res) {
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

	User.findOne({_id: userid}, function (err, foundObject){
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
});*/

router.post('/upload-photo', middlewares.isLoggedIn, function(req, res, next){
	//only allow .jpg and .png

	var form = new formidable.IncomingForm();
	form.parse(req, function (err, fields, files) {
		if(!fs.existsSync(AVATAR_DIR)) {
			fs.mkdirSync(AVATAR_DIR);
		}

		var ext = path.extname(files.fileToUpload.name);
		if(!ALLOWED_AVATAR_FORMAT.includes(ext)) {
			req.flash('error', 'File formats allowed: ' + ALLOWED_AVATAR_FORMAT);
			res.redirect('/profile');
			return;
		}

		var fileToRemove = null;
		fs.readdirSync(AVATAR_DIR).forEach(function(x) {
			if (x.startsWith(req.user._id.toString())) {
				fileToRemove = x;
			}
		});

		fs.unlinkSync(path.join(AVATAR_DIR, fileToRemove));

		var oldpath = files.fileToUpload.path;
		var newpath = path.join(AVATAR_DIR, req.user._id.toString() + ext);

		fs.rename(oldpath, newpath, function (err) {
			if (err) {
				next(err);
			}
			req.flash('success', 'Avatar updated.');
			res.redirect('/profile');
		});
	});
});

/*
Update username
*/
router.post('/update-username', middlewares.isLoggedIn, function(req, res, next) {
	var username = req.body.username;
	if (username == '') {
		req.flash('error', 'Username cannot be empty.');
		return res.redirect('/profile');
	}

	// find a user whose username is the same as the form username
	// we are checking to see if the user trying to login already exists
	User.findOne({ $and: [
		{ 'local.username': username },
		{ 'local.username': { $not: { $eq: req.user.local.username } } }
	] }, function(err, existingUser) {
		// if there are any errors, return the error
		if (err) {
			return next(err);
		}

		// check to see if theres already a user with that email
		if (existingUser) {
			req.flash('error', 'Username is already taken.');
			return res.redirect('/profile');
		}

		User.findById(
			req.user._id, 
			function (err, user) {
				if (err) {
					return next(err);
				}

				if (!user) {
					var err = new Error('Cannot find current user.');
					err.status = 404;
					return next(err);
				}

				user.local.username = username;
				user.save(function (err, updatedUser){
					if (err){
						return next(err);
					}
					req.flash('success', 'Username updated.');
					res.redirect('/profile');
				});
			}
		);
	});
});

/*
Update email
*/
router.post('/update-email', middlewares.isLoggedIn, function(req, res, next) {
	var email = req.body.email;
	if (email == '') {
		req.flash('error', 'Email cannot be empty.');
		return res.redirect('/profile');
	}

	// find a user whose email is the same as the forms email
	// we are checking to see if the user trying to login already exists
	User.findOne({ $and: [
		{ 'local.email': email },
		{ 'local.email': { $not: { $eq: req.user.local.email } } }
	] }, function(err, existingUser) {
		// if there are any errors, return the error
		if (err) {
			return next(err);
		}

		// check to see if theres another a user with that email
		if (existingUser) {
			req.flash('error', 'Email is already taken.');
			return res.redirect('/profile');
		}

		User.findById(
			req.user._id,
			function (err, user){
				if (err){
					return next(err);
				}

				if (!user){
					var err = new Error('Cannot find current user.');
					err.status = 404;
					return next(err);
				}

				user.local.email = email;
				user.save(function (err, updatedUser){
					if (err){
						return next(err);
					}
					req.flash('success', 'Email updated.');
					res.redirect('/profile');
				});
			}
		);
	});
});


router.post('/update-password',middlewares.isLoggedIn, function(req, res, next) {
	var password = req.body.password;
	var confirmPassword = req.body.confirmPassword;

	if (password == '') {
		req.flash('error', 'New password cannot be empty.');
		return res.redirect('/profile');
	}

	if (password != confirmPassword) {
		req.flash('error', 'New password and confirm password do not match.');
		return res.redirect('/profile');
	}

	User.findById(
		req.user._id,
		function (err, user){
			if (err){
				return next(err);
			}

			if (!user){
				var err = new Error('Cannot find current user.');
				err.status = 404;
				return next(err);
			}

			user.local.password = user.generateHash(password);
			user.save(function (err, updatedUser){
				if (err){
					return next(err);
				}
				req.flash('success', 'Password updated.');
				res.redirect('/profile');
			});
		}
	);
});

module.exports = router;
