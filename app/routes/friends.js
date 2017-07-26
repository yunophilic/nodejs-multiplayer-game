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
						title: 'All users',
						"users" : users
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
			//var userDob = user.dob.toISOString().substring(0, userdob.indexOf('T'));
			res.format({
        html: function(){
					res.render('users/show', {
						title: 'Users Profile',
						"users" : users
					});
				},
				json: function(){
					res.json(user);
				}
			});
		}
	});
});

module.exports = router;
