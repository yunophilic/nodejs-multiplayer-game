const TANK_INIT_HP = 100;

var helpers = require('../utils/helpers');

var Tank = require('../models/tank');
var Ball = require('../models/ball');

module.exports = function(socket, gameRoom) {
	var joinedGame = false;

	socket.on('joinGame', function(tank){
		if(gameRoom.tankExists(tank.id)) {
			socket.emit('deny game access');
			socket.disconnect(true);
			return;
		}

		/*console.log(tank.id + ' joined the game');*/
		var initX = helpers.getRandomInt(40, 900);
		var initY = helpers.getRandomInt(40, 500);
		socket.emit('addTank', { id: tank.id, type: tank.type, isLocal: true, x: initX, y: initY, hp: TANK_INIT_HP });
		socket.broadcast.emit('addTank', { id: tank.id, type: tank.type, isLocal: false, x: initX, y: initY, hp: TANK_INIT_HP} );

		gameRoom.addTank(new Tank(tank.id, tank.type, TANK_INIT_HP));

		joinedGame = true;
	});

	socket.on('sync', function(data){
		//Receive data from clients
		if(data.tank != undefined){
			gameRoom.syncTank(data.tank);
		}
		//update ball positions
		gameRoom.syncBalls();
		//Broadcast data to clients
		socket.emit('sync', gameRoom.getData());
		socket.broadcast.emit('sync', gameRoom.getData());

		//I do the cleanup after sending data, so the clients know
		//when the tank dies and when the balls explode
		gameRoom.cleanDeadTanks();
		gameRoom.cleanDeadBalls();
	});

	socket.on('shoot', function(ball){
		var ball = new Ball(ball.ownerId, ball.alpha, ball.x, ball.y );
		gameRoom.addBall(ball);
	});

	socket.on('leaveGame', function(tankId){
		if(joinedGame) {
			console.log(tankId + ' has left the game');
			gameRoom.removeTank(tankId);
			socket.broadcast.emit('removeTank', tankId);
		}
	});
};
