var express = require('express');
var middlewares = require('../utils/middlewares');
var router = express.Router();

/* GET chatting room page. */
// router.get('/', function(req, res, next) {
//   res.render('chat/index', { title: 'Chatting' });
// });
router.get('/', middlewares.isLoggedIn, function(req, res) {
  res.render('chat/index', {
    user : req.user // get the user out of session and pass to template
  });
});
module.exports = router;
