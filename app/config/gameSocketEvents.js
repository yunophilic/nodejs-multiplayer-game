const TANK_INIT_HP = 100;

var Ball = require('../models/ball.js');

module.exports = function(socket, gameServer) {
	console.log('User connected');

	socket.on('joinGame', function(tank){
		console.log(tank.id + ' joined the game');
		var initX = getRandomInt(40, 900);
		var initY = getRandomInt(40, 500);
		socket.emit('addTank', { id: tank.id, type: tank.type, isLocal: true, x: initX, y: initY, hp: TANK_INIT_HP });
		socket.broadcast.emit('addTank', { id: tank.id, type: tank.type, isLocal: false, x: initX, y: initY, hp: TANK_INIT_HP} );

		gameServer.addTank({ id: tank.id, type: tank.type, hp: TANK_INIT_HP});
	});

	socket.on('sync', function(data){
		//Receive data from clients
		if(data.tank != undefined){
			gameServer.syncTank(data.tank);
		}
		//update ball positions
		gameServer.syncBalls();
		//Broadcast data to clients
		socket.emit('sync', gameServer.getData());
		socket.broadcast.emit('sync', gameServer.getData());

		//I do the cleanup after sending data, so the clients know
		//when the tank dies and when the balls explode
		gameServer.cleanDeadTanks();
		gameServer.cleanDeadBalls();
	});

	socket.on('shoot', function(ball){
		var ball = new Ball(ball.ownerId, ball.alpha, ball.x, ball.y );
		gameServer.addBall(ball);
	});

	socket.on('leaveGame', function(tankId){
		console.log(tankId + ' has left the game');
		gameServer.removeTank(tankId);
		socket.broadcast.emit('removeTank', tankId);
	});
};

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}