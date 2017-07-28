var express = require('express');
var mongoose = require('mongoose'); //mongo connection
var bodyParser = require('body-parser'); //parses information from POST
var methodOverride = require('method-override'); //used to manipulate POST
var router = express.Router();

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
	//retrieve all users from Monogo
	mongoose.model('User').find({}, function (err, users) {
		if (err) {
			return console.error(err);
		} else {
			//respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
			res.format({
				//HTML response will render the index.ejs file in the views/users folder. We are also setting "users" to be an accessible variable in our jade view
				html: function(){
					res.render('users/index', {
						title: 'Search users'
					});
				},
				//JSON response will show all users in JSON format
				json: function(){
					res.json(users);
				}
			});
		}
	});
});

router.post('/', function(req, res) {
	// Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
	var username = req.body.username;
	var email = req.body.email;
	var dob = req.body.dob;
	//call the create function for our database
	mongoose.model('User').create({
		username : username,
		email : email,
		dob : dob
	}, function (err, user) {
		if (err) {
			res.send("There was a problem adding the information to the database.");
		} else {
			//user has been created
			console.log('POST creating new user: ' + user);
			res.format({
				//HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
				html: function(){
					// If it worked, set the header so the address bar doesn't still say /adduser
					//res.location("users");
					// And forward to success page
					res.redirect("/users");
				},
				//JSON response will show the newly created user
				json: function(){
					res.json(user);
				}
			});
		}
	})
});

/* GET New User page. */
router.get('/new', function(req, res) {
	res.render('users/new', { title: 'Register' });
});

// route middleware to validate :id
router.param('id', function(req, res, next, id) {
	//console.log('validating ' + id + ' exists');
	//find the ID in the Database
	mongoose.model('User').findById(id, function (err, user) {
		//if it isn't found, we are going to respond with 404
		if (err) {
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
	mongoose.model('User').findById(req.id, function (err, user) {
		if (err) {
			console.log('GET Error: There was a problem retrieving: ' + err);
		} else {
			console.log('GET Retrieving ID: ' + user._id);
			res.format({
				html: function(){
					res.render('users/show', {
						"user" : user
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
	mongoose.model('User').findById(req.id, function (err, user) {
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
	mongoose.model('User').findById(req.id, function (err, user) {
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

//DELETE a Blob by ID
/*router.delete('/:id', function (req, res){
	//find blob by ID
	mongoose.model('User').findById(req.id, function (err, user) {
		if (err) {
			return console.error(err);
		} else {
			//remove it from Mongo
			user.remove(function (err, deletedUser) {
				if (err) {
					return console.error(err);
				} else {
					//Returning success messages saying it was deleted
					console.log('DELETE removing ID: ' + deletedUser._id);
					res.format({
						//HTML returns us back to the main page, or you can create a success page
						html: function(){
							res.redirect("/users");
						},
						//JSON returns the item that has been deleted
						json: function(){
							res.json({
								message : 'deleted',
								item : deletedUser
							});
						}
					});
				}
			});
		}
	});
});*/

module.exports = router;
