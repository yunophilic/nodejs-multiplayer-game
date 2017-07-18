var express = require('express');
var router = express.Router();

/* GET chatting room page. */
router.get('/', function(req, res, next) {
  res.render('chat/index', { title: 'Chatting' });
});

module.exports = router;
