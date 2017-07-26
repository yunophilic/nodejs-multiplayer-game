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




module.exports = router;
