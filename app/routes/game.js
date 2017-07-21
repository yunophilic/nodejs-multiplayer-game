var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('game/index', { title: 'Play the game' });
});

module.exports = router;
