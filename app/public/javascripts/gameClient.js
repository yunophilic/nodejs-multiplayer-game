const WIDTH = 1100;
const HEIGHT = 580;

var socket = io();
var game = new Game('#arena', WIDTH, HEIGHT, socket);
var selectedTank = 1;
var tankName = '';

socket.on('deny game access', function() {
	window.location.replace("/game/error");
})

socket.on('addTank', function(tank){
	game.addTank(tank.id, tank.type, tank.isLocal, tank.x, tank.y);
});

socket.on('sync', function(gameServerData){
	game.receiveData(gameServerData);
});

socket.on('killTank', function(tankData){
	game.killTank(tankData);
});

socket.on('removeTank', function(tankId){
	game.removeTank(tankId);
});

$(document).ready( function() {
	$('#join').click( function() {
		$.get('/profile/username', function(data) {
			tankName = data.username;
			joinGame(tankName, selectedTank, socket);
		});
	});

	$('ul.tank-selection li').click( function(){
		$('.tank-selection li').removeClass('selected')
		$(this).addClass('selected');
		selectedTank = $(this).data('tank');
		$('#join').trigger('click');
	});
});

$(window).on('beforeunload', function() {
	socket.emit('leaveGame', tankName);
});

function joinGame(tankName, tankType, socket) {
	if(tankName != '') {
		$('#prompt').hide();
		socket.emit('joinGame', {id: tankName, type: tankType});
	}
}