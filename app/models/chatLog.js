var mongoose = require('mongoose');
var User = require('./user');

var chatLogSchema = mongoose.Schema({
	room: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	message: {
		type: String,
		trim: true
	},
	timestamp: {
		type: Date, 
		default: Date.now
	}
});

chatLogSchema.pre('save', function(next) {
	/*console.log('saving chat log');*/

	var chatLog = this;
	User.findOne({ 'local.username': chatLog.username }, function(err, user){
		/*console.log(chatLog.username);*/
		if(err || !user) {
			//this generally shouldn't happen if username cannot be changed
			/*console.log('error retrieving user');*/
			var err = new Error('Not Found');
			err.status = 404;
			return next(err);
		}
		next();
	});
});

module.exports = mongoose.model('ChatLog', chatLogSchema);