var WIDTH = 1100;
var HEIGHT = 580;
// This IP is hardcoded to my server, replace with your own
var socket = io();
var game = new Game('#arena', WIDTH, HEIGHT, socket);
var selectedTank = 1;
var tankName = '';

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

$(document).ready( function(){

	$('#join').click( function(){
		$.get('/game/tank-name', function(data) {
			tankName = data.tankName;
			joinGame(tankName, selectedTank, socket);
		});
		
	});

	$('ul.tank-selection li').click( function(){
		$('.tank-selection li').removeClass('selected')
		$(this).addClass('selected');
		selectedTank = $(this).data('tank');/*
			joinGame(tankName, selectedTank, socket);
		});*/
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