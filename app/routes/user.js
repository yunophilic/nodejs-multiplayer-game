routes/user.js:

var express = require('express');
var User = require('../controllers/user');
var passport = require('passport');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/login', passport.authenticate('local',
  { successFlash: 'Success!',
    failureFlash : 'Login failed' }));