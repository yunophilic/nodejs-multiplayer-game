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
					return next(err);
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
		if (err || !user) {
			/*console.log(id + ' was not found');*/
			res.status(404)
			var err = new Error('Not Found');
			err.status = 404;
			res.format({
				html: function() {
					next(err);
				},
				json: function() {
					res.json({
						status: err.status,
						message: err.message
					});
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
			next(err);
		} else if (req.isAuthenticated() && req.user._id.equals(user._id)) {
			//user selects himself
			res.redirect("/profile");
		} else {
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

router.get('/:id/img', function(req, res) {
	User.findById(req.id, function (err, user) {
		if (err) {
			next(err);
		} else if (req.isAuthenticated() && req.user._id.equals(user._id)) {
			//user selects himself
			res.redirect("/profile/img");
		} else {
			res.sendFile(helpers.getUserAvatarPath(user._id.toString()));
		}
	});
});

router.put('/:id/add', middlewares.isLoggedIn, function(req, res) {
	User.findById(req.id, function(err, user) {
		if (err) {
			/*console.log("error retrieving user");*/
			return next(err);
		}

		var currentUserIdStr = req.user._id.toString();

		if (!user.friendRequests.includes(currentUserIdStr)) {
			user.friendRequests.push(currentUserIdStr);
			user.save(function(err, updatedUser) {
				if (err) {
					/*console.log("error saving user");*/
					return next(err);
				}

				res.json({updatedUsers: [updatedUser]});
			});
		} else {
			res.json({updatedUsers: []});
		}
	});
});

router.put('/:id/cancel', middlewares.isLoggedIn, function(req, res) {
	User.findById(req.id, function(err, user) {
		if (err) {
			/*console.log("error retrieving user");*/
			return next(err);
		}

		var currentUserIdStr = req.user._id.toString();

		if (user.friendRequests.includes(currentUserIdStr)) {
			user.friendRequests.remove(currentUserIdStr);
			user.save(function(err, updatedUser) {
				if (err) {
					/*console.log("error saving user");*/
					return next(err);
				}

				res.json({updatedUsers: [updatedUser]});
			});
		} else {
			res.json({updatedUsers: []});
		}
	});
});

router.put('/:id/accept', middlewares.isLoggedIn, function(req, res) {
	User.findById(req.id, function(err, user) {
		if (err) {
			/*console.log("error retrieving user");*/
			return next(err);
		}

		var currentUser = req.user;
		var userIdStr = user._id.toString();

		if (currentUser.friendRequests.includes(userIdStr)) {
			var updatedUsers = [];

			currentUser.friendRequests.remove(userIdStr);
			currentUser.friends.push(userIdStr)
			currentUser.save(function(err, updatedUser) {
				if (err) {
					/*console.log("error saving user");*/
					return next(err);
				}

				updatedUsers.push(updatedUser);
			});

			user.friends.push(currentUser._id.toString());
			user.save(function(err, updatedUser) {
				if (err) {
					/*console.log("error saving user");*/
					return next(err);
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

router.put('/:id/reject', middlewares.isLoggedIn, function(req, res) {
	var currentUser = req.user;
	if (currentUser.friendRequests.includes(req.id)) {
		currentUser.friendRequests.remove(req.id);
		currentUser.save(function(err, updatedUser) {
			if (err) {
				/*console.log("error saving user");*/
				return next(err);
			}

			res.json({updatedUsers: [updatedUser]});
		});
	} else {
		res.json({updatedUsers: []});
	}
});

router.put('/:id/remove', middlewares.isLoggedIn, function(req, res) {
	User.findById(req.id, function(err, user) {
		if (err) {
			/*console.log("error retrieving user");*/
			return next(err);
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
					/*console.log("error saving user");*/
					return next(err);
				}

				updatedUsers.push(updatedUser);
			});

			currentUser.friends.remove(userIdStr);
			currentUser.save(function(err, updatedUser) {
				if (err) {
					/*console.log("error saving user");*/
					return next(err);
				}

				updatedUsers.push(updatedUser);
			});

			res.json({updatedUsers: updatedUsers});
		} else {
			res.json({updatedUsers: []});
		}
	});
});

router.get('/:id/chat', middlewares.isLoggedIn, function(req, res) {
	User.findById(req.id, function(err, user) {
		if (err) {
			/*console.log("error retrieving user");*/
			return next(err);
		}

		var currentUser = req.user;

		var isConnected = user.friends.includes(currentUser._id.toString()) &&
			currentUser.friends.includes(user._id.toString());

		res.format({
			html: function() {
				if (!isConnected) {
					return res.render('users/not-connected', {
						user: user
					});
				}
				res.render('users/chat', {
					currentUser: currentUser,
					user: user,
					layout: 'layouts/no-container'
				});
			},
			json: function() {
				if (!isConnected) {
					res.json({
						status: 403,
						message: 'Not Connected'
					});
				}

				var username1 = currentUser.local.username;
				var username2 = user.local.username;

				//sort to disregard order
				var x = [username1, username2];
				x.sort();
				
				var roomId = 'room_' + x[0] + '_' + x[1];
				res.json({
					roomId: roomId
				});
			}
		});
	});
});



router.get('/:id/mutual', function(req, res) {
	User.findById(req.id, function (err, user) {
		if (err) {
			next(err);
		} 
		else {
             
             if(req.user.local.username == user.local.username){
             	res.format({
				json: function(){
					res.json(["It's yourself"]);
				}
			    });
             }else{
             	var mutual_friend = [];

                 for (var i = 0; i < user.friends.length; i++) {
                      if (req.user.friends.indexOf(user.friends[i]) !== -1) {
                       mutual_friend.push(user.friends[i]);
                 }

               }
                  console.log(mutual_friend.length);
			      res.format({
				  json: function(){
				     	res.json(mutual_friend);
				    }
		    	});
             }

			
		}
	});
});


module.exports = router;
