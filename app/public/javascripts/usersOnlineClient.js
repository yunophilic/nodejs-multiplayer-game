$(document).ready(function() {
	var socket = io();

	socket.on('user online', function(data) {
		//update sidebar
		$('#online-status-' + data.username).addClass("online-indicator");
	});

	socket.on('user offline', function(data){
		//update sidebar
		$('#online-status-' + data.username).removeClass("online-indicator");
	});
	
	$.get('/profile/username', function(data) {
		console.log(data);
		if(data.status == 403) {
			return;
		}
		var username = data.username;
		socket.emit('go online', username);
	}, 'json');
});

/*$(window).on('beforeunload', function() {
	console.log('trigger');
	$.get('/profile/username', function(data) {
		if(data.status == 403)
			return;
		var username = data.username;
		socket.emit('go offline', username);
	}, 'json');
});*/