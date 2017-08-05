var mongoose = require('mongoose');

var chatLogSchema = mongoose.Schema({
	senderUserId: String,
	content: String,
	timeStamp: Timestamp
});

module.exports = mongoose.model('ChatLog', chatLogSchema);