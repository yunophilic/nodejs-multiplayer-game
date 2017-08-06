var express = require('express');
var middlewares = require('../utils/middlewares');
var router = express.Router();

router.get('/', middlewares.isLoggedIn, function(req, res) {
	res.render('game/index', { title: 'Free Roam', layout: 'layouts/no-container' });
});

router.get('/error', function(req, res) {
	res.render('game/error');
});

module.exports = router;
