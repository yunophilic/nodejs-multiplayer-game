var express = require('express');
var bodyParser = require('body-parser'); //parses information from POST
var methodOverride = require('method-override'); //used to manipulate POST
var middlewares = require('../utils/middlewares');
var helpers = require('../utils/helpers');
var router = express.Router();

var User = require('../models/user');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}));

/* GET users listing. */
router.get('/', function(req, res, next) {
	//respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
	res.format({
		//HTML response will render the index.ejs file in the views/users folder. We are also setting "users" to be an accessible variable in our jade view
		html: function(){
			res.render('users/index', {
				title: 'Search users',
				layout: 'layouts/angular'
			});
		},
		//JSON response will show all users in JSON format
		json: function(){
			//retrieve all users from Monogo
			User.find({}, function (err, users) {
				if (err) {
					return console.error(err);
				} else {
					res.json(users);
				}
			});
		}
	});
});

// route middleware to validate :id
router.param('id', function(req, res, next, id) {
	//find the ID in the Database
	User.findById(id, function (err, user) {
		//if it isn't found, we are going to respond with 404
		if (err || user == null) {
			console.log(id + ' was not found');
			res.status(404)
			var err = new Error('Not Found');
			err.status = 404;
			res.format({
				html: function() {
					next(err);
				},
				json: function() {
					res.json({message : err.status	+ ' ' + err});
				}
			});
		//if it is found we continue on
		} else {
			//uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
			//console.log(user);
			// once validation is done save the new item in the req
			req.id = id;
			// go to the next thing
			next();
		}
	});
});

router.get('/:id', function(req, res) {
	User.findById(req.id, function (err, user) {
		if (err) {
			console.log('GET Error: There was a problem retrieving: ' + err);
		} else if (req.isAuthenticated() && req.user._id.equals(user._id)) {
			//user selects himself
			res.redirect("/profile");
		} else {
			/*console.log('GET retrieving user: ' + user);
			console.log('current user: ' + req.user);*/
			res.format({
				html: function(){
					res.render('users/show', {
						user: user,
						currentUser: req.user
					});
				},
				json: function(){
					res.json(user);
				}
			});
		}
	});
});

/* GET Edit User page. */
/*router.get('/:id/edit', function(req, res) {
	//search for the user within Mongo
	User.findById(req.id, function (err, user) {
		if (err) {
			console.log('GET Error: There was a problem retrieving: ' + err);
		} else {
			//Return the user
			console.log('GET Retrieving ID: ' + user._id);
			//format the date properly for the value to show correctly in our edit form
			var userDob = user.dob.toISOString().substring(0, userdob.indexOf('T'))
			res.format({
				//HTML response will render the 'edit.jade' template
				html: function(){
					res.render('users/edit', {
						title: 'User' + user._id,
						"userDob" : userDob,
						"user" : user
					});
				},
				 //JSON response will return the JSON output
				json: function(){
					res.json(user);
				}
			});
		}
	});
});*/

//PUT to update a blob by ID
/*router.put('/:id/edit', function(req, res) {
	// Get our REST or form values. These rely on the "name" attributes
	var name = req.body.name;
	var badge = req.body.badge;
	var dob = req.body.dob;
	var company = req.body.company;
	var isloved = req.body.isloved;

	//find the document by ID
	User.findById(req.id, function (err, user) {
		//update it
		user.update({
			username : username,
			email : email,
			dob : dob
		}, function (err, updatedUser) {
			if (err) {
				res.send("There was a problem updating the information to the database: " + err);
			}
			else {
				//HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
				res.format({
					html: function(){
						res.redirect("/users/" + updatedUser._id);
					},
					//JSON responds showing the updated values
					json: function(){
						res.json(updatedUser);
					}
				});
			}
		})
	});
});*/

router.put('/:id/add', function(req, res) {
	User.findById(req.id, function(err, user) {
		if (err) {
			console.log("error retrieving user");
			helpers.setErrorResponse(res);
			return;
		}

		var currentUserIdStr = req.user._id.toString();

		if (!user.friendRequests.includes(currentUserIdStr)) {
			user.friendRequests.push(currentUserIdStr);
			user.save(function(err, updatedUser) {
				if (err) {
					console.log("error saving user");
					helpers.setErrorResponse(res);
					return;
				}

				res.json({updatedUsers: [updatedUser]});
			});
		} else {
			res.json({updatedUsers: []});
		}
	});
});

router.put('/:id/cancel', function(req, res) {
	User.findById(req.id, function(err, user) {
		if (err) {
			console.log("error retrieving user");
			helpers.setErrorResponse(res);
			return;
		}

		var currentUserIdStr = req.user._id.toString();

		if (user.friendRequests.includes(currentUserIdStr)) {
			user.friendRequests.remove(currentUserIdStr);
			user.save(function(err, updatedUser) {
				if (err) {
					console.log("error saving user");
					helpers.setErrorResponse(res);
					return;
				}

				res.json({updatedUsers: [updatedUser]});
			});
		} else {
			res.json({updatedUsers: []});
		}
	});
});

router.put('/:id/accept', function(req, res) {
	User.findById(req.id, function(err, user) {
		if (err) {
			console.log("error retrieving user");
			helpers.setErrorResponse(res);
			return;
		}

		var currentUser = req.user;
		var userIdStr = user._id.toString();

		if (currentUser.friendRequests.includes(userIdStr)) {
			var updatedUsers = [];

			currentUser.friendRequests.remove(userIdStr);
			currentUser.friends.push(userIdStr)
			currentUser.save(function(err, updatedUser) {
				if (err) {
					console.log("error saving user");
					helpers.setErrorResponse(res);
					return;
				}

				updatedUsers.push(updatedUser);
			});

			user.friends.push(currentUser._id.toString());
			user.save(function(err, updatedUser) {
				if (err) {
					console.log("error saving user");
					helpers.setErrorResponse(res);
					return;
				}

				updatedUsers.push(updatedUser);
			});

			res.json({
				updatedUsers: updatedUsers
			})
		} else {
			res.json({updatedUsers: []});
		}
	});
});

router.put('/:id/reject', function(req, res) {
	var currentUser = req.user;
	if (currentUser.friendRequests.includes(req.id)) {
		currentUser.friendRequests.remove(req.id);
		currentUser.save(function(err, updatedUser) {
			if (err) {
				console.log("error saving user");
				helpers.setErrorResponse(res);
				return;
			}

			res.json({updatedUsers: [updatedUser]});
		});
	} else {
		res.json({updatedUsers: []});
	}
});

router.put('/:id/remove', function(req, res) {
	User.findById(req.id, function(err, user) {
		if (err) {
			console.log("error retrieving user");
			helpers.setErrorResponse(res);
			return;
		}

		var userIdStr = user._id.toString();
		var currentUser = req.user;
		var currentUserIdStr = currentUser._id.toString();

		if (user.friends.includes(currentUserIdStr) && 
			currentUser.friends.includes(userIdStr)) {
			var updatedUsers = [];

			user.friends.remove(currentUserIdStr);
			user.save(function(err, updatedUser) {
				if (err) {
					console.log("error saving user");
					helpers.setErrorResponse(res);
					return;
				}

				updatedUsers.push(updatedUser);
			});

			currentUser.friends.remove(userIdStr);
			currentUser.save(function(err, updatedUser) {
				if (err) {
					console.log("error saving user");
					helpers.setErrorResponse(res);
					return;
				}

				updatedUsers.push(updatedUser);
			});

			res.json({updatedUsers: updatedUsers});
		} else {
			res.json({updatedUsers: []});
		}
	});
});

module.exports = router;
