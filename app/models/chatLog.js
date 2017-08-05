var mongoose = require('mongoose');
var User = require('./user');

var chatLogSchema = mongoose.Schema({
	room:{
		type: String,
		required: true
	},
	senderUsername: {
		type: String,
		unique: true,
		required: true
	},
	content: {
		type: String,
		trim: true
	}
});

chatLogSchema.pre('save', function(next) {
	User.findOne({ 'local.username': socket.username }, function(err, user){
		if(err || !user) {
			//this generally shouldn't happen if username cannot be changed
			console.log('error retrieving user');
			var err = new Error('Not Found');
			err.status = 404;
			next(err);
		}
	});
});

module.exports = mongoose.model('ChatLog', chatLogSchema);