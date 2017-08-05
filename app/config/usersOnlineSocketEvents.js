module.exports = function(socket, usersOnline) {
	socket.on('go online', function(username) {
		console.log(username + ' go online');
		
		socket.username = username;

		if(!usersOnline.addUser(socket.username)) {
			return; //exit if fail
		}

		//broadcast to global room
		socket.broadcast.emit('user online', {
			username: socket.username
		});
	});

	socket.on('go offline', function() {
		var username = socket.username;
		console.log(username + ' go offline');

		if (!usersOnline.removeUser(username)) {
			return; //exit if fail
		}

		//user closes all tabs of the site
		if (!usersOnline.userExists(username)) {
			//broadcast to global room
			socket.broadcast.emit('user offline', {
				username: username
			});
		}
	});
}