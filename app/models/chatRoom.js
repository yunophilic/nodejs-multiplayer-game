var User = require('../models/user');
var ChatLog = require('../models/chatLog');

function ChatRoom(){
	this.users = {}; //hash table of (username, tabs) entry to handle multiple tabs
}

ChatRoom.prototype = {
	addUser: function(username) {
		if(!username){
			return false;
		}

		if (!this.users[username]) {
			this.users[username] = 0;
		}
		this.users[username]++;

		return true;
	},

	removeUser: function(username) {
		if (!username) {
			return false;
		}

		if (this.users.hasOwnProperty(username)) {
			this.users[username]--;
			if (this.users[username] === 0) {
				delete this.users[username];
			}
		}

		return true;
	},

	userExists: function(username) {
		return this.users.hasOwnProperty(username);
	},

	getNumUsers: function() {
		return Object.keys(this.users).length;
	},

	saveMessage: function(room, username, message) {
		console.log('saving new message');
		var chatLog = new ChatLog();
		chatLog.room = room;
		chatLog.senderUsername = username;
		chatLog.content = message;
		chatLog.save();
	}
};

module.exports = ChatRoom;