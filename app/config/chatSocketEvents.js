module.exports = function(socket, chatRooms) {
	var addedUser = false; //lock to prevent adding user on same socket connection (different tab == different connection)
	
	// when the client emits 'new message', this listens and executes
	socket.on('new message', function (data) {
		console.log(data);
		// we tell the client to execute 'new message'
		socket.broadcast.emit('new message', {
			username: socket.username,
			message: data
		});
	});

	// when the client emits 'join general chat', this listens and executes
	socket.on('join general chat', function (username) {
		if (addedUser)
			return;

		// store stuffs in the socket session for this client
		socket.username = username;
		socket.room = 'general_chat';

		// send client to current room
		socket.join(socket.room);
		
		var chatRoom = chatRooms[socket.room];
		if (chatRoom.userExists(username)) {
			socket.emit('deny chat access');
			socket.disconnect(true);
			return;
		}

		chatRoom.addUser(username);
		var numUsers = chatRoom.getNumUsers();

		addedUser = true;

		// echo current client
		socket.emit('join', {
			numUsers: numUsers
		});

		// echo other clients in current room that a person has connected
		socket.broadcast.to(socket.room).emit('user joined', {
			username: socket.username,
			numUsers: numUsers
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
		//console.log('DISCONNECT CALLED');

		if (!addedUser)
			return;

		var username = socket.username;
		var room = socket.room;
		var chatRoom = chatRooms[room];
		chatRoom.removeUser(username);

		//user not in chat in any other tab
		if(!chatRoom.userExists(username)) {
			// echo other clients in current room that this client has left
			socket.broadcast.to(room).emit('user left', {
				username: username,
				numUsers: chatRoom.getNumUsers()
			});
		}

		// leave the current room
		socket.leave(room);
	});
}