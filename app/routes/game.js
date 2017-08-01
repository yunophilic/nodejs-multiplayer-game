var express = require('express');
var middlewares = require('../utils/middlewares');
var router = express.Router();

router.get('/free-roam', middlewares.isLoggedIn, function(req, res, next) {
	res.render('game/freeRoam', { title: 'Free Roam', layout: 'layouts/no-container' });
});

router.get('/tank-name', middlewares.isLoggedIn, function(req, res, next) {
	res.json({tankName: req.user.local.username});
});

module.exports = router;
