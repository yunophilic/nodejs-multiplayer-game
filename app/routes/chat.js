var express = require('express');
var middlewares = require('../utils/middlewares');
var router = express.Router();

/* GET chatting room page. */
router.get('/', middlewares.isLoggedIn, function(req, res) {
	res.render('chat/index', {
		user : req.user, // get the user out of session and pass to template
		layout: 'layouts/no-container'
	});
});

router.get('/error', middlewares.isLoggedIn, function(req, res) {
	res.render('chat/error');
});

module.exports = router;
