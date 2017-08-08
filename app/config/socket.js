//imports
var socket_io = require('socket.io');
var bindUsersOnlineSocketEvents = require('./usersOnlineSocketEvents');
var bindChatSocketEvents = require('./chatSocketEvents');
var bindGameSocketEvents = require('./gameSocketEvents');

//models
var UsersOnline = require('../models/usersOnline');
var ChatRoom = require('../models/chatRoom');
var GameRoom = require('../models/gameRoom');

module.exports = function (app, server) {
	var io = socket_io(server);
	app.set('io', io);

	//global objects
	var usersOnline = new UsersOnline();
	var chatRooms = {};
	var gameRoom = new GameRoom();

	io.on('connection', function (socket) {
		bindUsersOnlineSocketEvents(socket, usersOnline);
		bindChatSocketEvents(socket, chatRooms);
		bindGameSocketEvents(socket, gameRoom);
	});
};