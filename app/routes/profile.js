var express = require('express');
var mongoose = require('mongoose');
var formidable = require('formidable');
var fs = require('fs');
var mv = require('mv'); //used to move files since fs.rename() doesn't work cross devices
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
	res.render('profile/index', {
		user : req.user
	});
});

router.get('/img', middlewares.isLoggedIn, function(req, res) {
	res.sendFile(helpers.getUserAvatarPath(req.user._id.toString()));
});

router.get('/username', middlewares.isLoggedIn, function(req, res) {
	res.json({username: req.user.local.username});
});

router.get('/friend-requests', middlewares.isLoggedIn, function(req, res, next) {
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
					return next(err);
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

router.get('/friends', middlewares.isLoggedIn, function(req, res, next) {
	res.format({
		html: function() {
			res.render('profile/friends', {
				title : "Friends",
				layout: 'layouts/angular'
			});
		},
		json: function() {
			/*console.log(req.user.friends);*/
			User.find({ _id: { $in: req.user.friends } }, function(err, users) {
				if (err) {
					return next(err);
				} else {
					/*console.log(users);*/
					res.json(users);
				}
			});
		}
	});
});

router.get('/settings', middlewares.isLoggedIn, function(req, res, next) {
	res.json(req.user.settings);
});

router.put('/settings', middlewares.isLoggedIn, function(req, res, next) {
	/*console.log('saving settings');*/

	var sidePanelFlag = req.body.sidePanelFlag;
	var bgmFlag = req.body.bgmFlag;
	var user = req.user;
	
	if (sidePanelFlag !== undefined) {
		user.settings.sidePanelFlag = sidePanelFlag;
	}

	if (bgmFlag !== undefined) {
		user.settings.bgmFlag = bgmFlag;
	}

	user.save(function(err, user) {
		if(err) {
			next(err);
		}
		res.json(user.settings);
	});
});

router.post('/upload-photo', middlewares.isLoggedIn, function(req, res, next) {
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
		// Check if it is a valid image file	
		var oldpath = files.fileToUpload.path;	
		fs.readFile(oldpath, function (err, data) {
			var magic = {
				jpg: 'ffd8ffe0',
				png: '89504e47'
			};
			var magicNumberInBody = data.toString('hex', 0, 4);
			
			if (!(magicNumberInBody == magic.jpg || magicNumberInBody == magic.png )) {				
				req.flash('error', 'Invalid profile pictures');
				res.redirect('/profile');
				return;
			}
			
			if (err) {
				req.flash('error', 'Unable to open ' + ext + "file");
				res.redirect('/profile');
				return;
			}

			var fileToRemove = null;
			fs.readdirSync(AVATAR_DIR).forEach(function(x) {
				if (x.startsWith(req.user._id.toString())) {
					fileToRemove = x;
				}
			});
			if (fileToRemove) {
				fs.unlinkSync(path.join(AVATAR_DIR, fileToRemove));
			}

			var newpath = path.join(AVATAR_DIR, req.user._id.toString() + ext);

			mv(oldpath, newpath, {mkdirp: true},function (err) {
				if (err) {
					return next(err);
				}
				req.flash('success', 'Avatar updated.');
				res.redirect('/profile');
				return;
			});

			if (err) {
				req.flash('error', 'Outer');
				res.redirect('/profile');
				return; 
			}	
		});		
	});
});

/*
Update username
*/
/*router.post('/update-username', middlewares.isLoggedIn, function(req, res, next) {
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
});*/

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


router.post('/update-password', middlewares.isLoggedIn, function(req, res, next) {
	var currentPassword = req.body.currentPassword;
	var newPassword = req.body.newPassword;
	var confirmPassword = req.body.confirmPassword;

	if (!req.user.validPassword(currentPassword)) {
		req.flash('error', 'Current password is wrong.');
		return res.redirect('/profile');
	}

	if (newPassword == '') {
		req.flash('error', 'New password cannot be empty.');
		return res.redirect('/profile');
	}

	if (newPassword != confirmPassword) {
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

			user.local.password = newPassword;
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
