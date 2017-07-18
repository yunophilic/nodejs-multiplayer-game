var express = require('express');
var router = express.Router();
var http = require('http').Server(express);
var io = require('socket.io')(http);
/* GET chatting room page. */
router.get('/', function(req, res, next) {
  res.render('chat/index', { title: 'Chatting' });
});
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});
module.exports = router;
