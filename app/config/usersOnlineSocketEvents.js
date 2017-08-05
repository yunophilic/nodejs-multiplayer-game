module.exports = function(socket, usersOnline) {
	socket.on('go online', function(username) {
		console.log(username + ' go online');
		
		socket.username = username;
		socket.type = "user_online_activity";

		if(!usersOnline.addUser(socket.username)) {
			return; //exit if fail
		}

		//broadcast to global room
		socket.broadcast.emit('user online', {
			username: socket.username
		});
	});

	socket.on('disconnect', function() {
		if(!socket.type == "user_online_activity")
			return;
		var username = socket.username;
		console.log(username + ' go offline');

		if (!usersOnline.removeUser(username)) {
			console.log('fail');
			return; //exit if fail
		}

		//user closes all tabs of the site
		if (!usersOnline.userExists(username)) {
			console.log('broadcasting');
			//broadcast to global room
			socket.broadcast.emit('user offline', {
				username: username
			});
		}
	});
}