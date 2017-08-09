var ChatRoom = require('../models/chatRoom');

module.exports = function(socket, chatRooms) {
	// lock
	// prevent adding user on same socket connection (different tab == different connection)
	// prevent removing user from chatroom when not added to ChatRoom object
	var addedUser = false; 
	
	// when the client emits 'new message', this listens and executes
	socket.on('new message', function (message) {
		/*console.log(message);
		console.log(socket.room);*/

		if (!socket.room)
			return;

		// don't save in game messages
		if(socket.room != 'game_chat') {
			/*console.log('try saving');*/
			chatRooms[socket.room].saveMessage(socket.username, message);
		}

		// we tell the client subscribed in current room to execute 'new message'
		socket.broadcast.to(socket.room).emit('new message', {
			username: socket.username,
			message: message
		});
	});

	// when the client emits 'join chat', this listens and executes
	socket.on('join chat', function (data) {
		if (addedUser)
			return;

		/*console.log('(' + data.username + ', ' + data.room + ')');*/

		// store stuffs in the socket session for this client
		socket.username = data.username;
		socket.room = data.room;

		// send client to current room
		socket.join(socket.room);
		
		var chatRoom = chatRooms[socket.room];
		if (!chatRoom) {
			/*console.log('new room');*/
			chatRooms[socket.room] = new ChatRoom(socket.room);
			chatRoom = chatRooms[socket.room];
		}

		/*var isGroupChat = (socket.room == 'general_chat' || socket.room == 'game_chat');*/
		if (chatRoom.userExists(socket.username)) {
			socket.emit('deny chat access');
			socket.disconnect(true);
			return;
		}

		chatRoom.addUser(socket.username);
		var numUsers = chatRoom.getNumUsers();

		addedUser = true;

		chatRoom.getMessages(function(err, chatLogs) {
			var previousMessages = [];
			if (!err) {
				/*console.log('chat logs:')
				console.log(chatLogs);*/
				previousMessages = chatLogs;
			}
			

			// echo current client
			socket.emit('join', {
				numUsers: numUsers,
				previousMessages: previousMessages
			});

			// echo other clients in current room that a person has connected
			socket.broadcast.to(socket.room).emit('user joined', {
				username: socket.username,
				numUsers: numUsers
			});
		});
	});

	// when the client emits 'typing', we broadcast to other clients in current room
	socket.on('typing', function () {
		socket.broadcast.to(socket.room).emit('typing', {
			username: socket.username
		});
	});

	// when the client emits 'stop typing', we broadcast to other clients in current room
	socket.on('stop typing', function () {
		socket.broadcast.to(socket.room).emit('stop typing', {
			username: socket.username
		});
	});

	// when the user disconnects.. perform this
	socket.on('disconnect', function () {
		if (addedUser) {
			/*console.log('disconnecting from chat');*/

			var username = socket.username;
			var room = socket.room;
			var chatRoom = chatRooms[room];
			chatRoom.removeUser(username);

			// echo other clients in current room that this client has left
			socket.broadcast.to(room).emit('user left', {
				username: username,
				numUsers: chatRoom.getNumUsers()
			});
		}

		// leave the current room
		socket.leave(socket.room);
	});
}