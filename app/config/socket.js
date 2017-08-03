//imports
var socket_io = require('socket.io');
var bindChatSocketEvents = require('./chatSocketEvents');
var bindGameSocketEvents = require('./gameSocketEvents');

//models
var ChatRoom = require('../models/chatRoom');
var GameRoom = require('../models/gameRoom');

module.exports = function (server) {
	var io = socket_io(server);

	//global objects

	var chatRooms = {};
	chatRooms['general_chat'] = new ChatRoom();
	chatRooms['game_chat'] = new ChatRoom();

	var gameRoom = new GameRoom();

	io.on('connection', function (socket) {
		bindChatSocketEvents(socket, chatRooms);
		bindGameSocketEvents(socket, gameRoom);
	});
};