const BALL_SPEED = 10;

var lastBallId = 0;

function Ball(ownerId, alpha, x, y){
	this.id = lastBallId;
	lastBallId ++;
	this.ownerId = ownerId;
	this.alpha = alpha; //angle of shot in radians
	this.x = x;
	this.y = y;
	this.out = false;
};

Ball.prototype = {

	fly: function(){
		//move to trayectory
		var speedX = BALL_SPEED * Math.sin(this.alpha);
		var speedY = -BALL_SPEED * Math.cos(this.alpha);
		this.x += speedX;
		this.y += speedY;
	}

}

module.exports = Ball;