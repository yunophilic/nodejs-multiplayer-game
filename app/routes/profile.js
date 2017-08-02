var express = require('express');
var middlewares = require('../utils/middlewares');
var router = express.Router();

//models
var User = require('../models/user');

// =====================================
// PROFILE SECTION =====================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)

router.get('/', middlewares.isLoggedIn, function(req, res) {
	res.render('profile/index', {
		user : req.user // get the user out of session and pass to template
	});
});

router.get('/edit', middlewares.isLoggedIn, function(req, res) {
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
});

/*
Update username
*/
router.post('/editusername',middlewares.isLoggedIn, function(req, res) {
		var username = req.body.username;
		//username = encodeURI(username);
		var userid = req.user._id;
		if (username == "") {
			res.send('All fields are required');
		}else{
			//res.send(username);

			// find a user whose email is the same as the forms email
			// we are checking to see if the user trying to login already exists
			User.findOne({ $or: [
				{'local.username': username}
			] }, function(err, user) {
				// if there are any errors, return the error
				if (err) {
					res.status(500).send();
				}

				// check to see if theres already a user with that email
				if (user) {
					res.send('That username is already taken.');
				} else {

						User.findOne({_id: userid}, function (err, foundObject){
							if (err){
								res.send('Error while finding current user');
							} else {
								if (!foundObject){
									res.send('Cannot find current user');
								}else{
									foundObject.local.username = username;
								}
								foundObject.save(function (err,updatedObejct){
									if (err){
										res.send('Error while updating current user');
									}else{
										res.redirect('/profile/');
									}
								});
							}
						});

				}

			});
		}
});

module.exports = router;