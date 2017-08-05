var User = require('../models/user');
var ChatLog = require('../models/chatLog');

function ChatRoom(){
	this.users = new Set();
}

ChatRoom.prototype = {
	addUser: function(username) {
		this.users.add(username);
	},

	removeUser: function(username) {
		this.users.delete(username);
	},

	userExists: function(username) {
		return this.users.has(username);
	},

	getNumUsers: function() {
		return this.users.size;
	},

	newMessage: function(username, message) {
		var chatLog = new ChatLog();
		chatLog.senderUsername = username;
		chatLog.content = message;
		chatLog.save();
	}
};

module.exports = ChatRoom;