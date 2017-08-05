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
	console.log('saving chat log');

	var chatLog = this;
	User.findOne({ 'local.username': chatLog.senderUsername }, function(err, user){
		console.log(chatLog.senderUsername);
		if(err || !user) {
			//this generally shouldn't happen if username cannot be changed
			console.log('error retrieving user');
			var err = new Error('Not Found');
			err.status = 404;
			return next(err);
		}
		next();
	});
});

module.exports = mongoose.model('ChatLog', chatLogSchema);