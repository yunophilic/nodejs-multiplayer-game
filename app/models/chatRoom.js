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
	}
};

module.exports = ChatRoom;