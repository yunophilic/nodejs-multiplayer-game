var User = require('../models/user');
var ChatLog = require('../models/chatLog');

function ChatRoom(room) {
	this.room = room; // room identifier
	this.users = {}; // hash table of (username, tabs) entry to handle multiple tabs
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

	saveMessage: function(username, message) {
		/*console.log('saving new message');
		console.log('room: ' + this.room);
		console.log('username: ' + username);
		console.log('message: ' + message);*/

		//fails if username not found
		if(!this.users[username]) {
			return false;
		}

		var chatLog = new ChatLog();
		chatLog.room = this.room;
		chatLog.username = username;
		chatLog.message = message;
		chatLog.save();
		return true;
	},

	//have to use callback func since mongoose doesn't support synchronous calls
	getMessages: function(callback) {
		//reference: https://stackoverflow.com/questions/5830513/how-do-i-limit-the-number-of-returned-items
		ChatLog.find({
			room: this.room
		}).sort({timestamp: -1}).limit(50).exec(callback);
	}
};

module.exports = ChatRoom;