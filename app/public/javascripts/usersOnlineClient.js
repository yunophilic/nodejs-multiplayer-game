var socket = io();

socket.on('user online', function(data) {
	//update sidebar
	$('#online-status-' + data.username).addClass("online-indicator");
});

socket.on('user offline', function(data){
	//update sidebar
	$('#online-status-' + data.username).removeClass("online-indicator");
});

$(document).ready(function() {
	$.get('/profile/username', function(data) {
		if(data.status == 403) {
			socket.emit('go offline');
			return;
		}
		var username = data.username;
		socket.emit('go online', username);
	}, 'json');
}, 3000);

$(window).on('beforeunload', function() {
	$.get('/profile/username', function(data) {
		if(data.status == 403)
			return;
		var username = data.username;
		socket.emit('go offline', username);
	}, 'json');
});