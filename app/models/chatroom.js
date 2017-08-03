function ChatRoom(){
	this.users = {}; //use hashtable to handle multiple tabs (username, tabs)
}

ChatRoom.prototype = {
	addUser: function(username) {
		if (!this.users[username]) {
			this.users[username] = 0;
		}
		this.users[username] ++;
	},

	removeUser: function(username) {
		if(!username || !this.userExists(username)) {
			return false;
		}

		// decrement reference count for this user
		// and remove user if reference count hits zero
		this.users[username] --;
		if (this.users[username] === 0) {
			delete this.users[username];
		}

		return true;
	},

	userExists: function(username) {
		return this.users.hasOwnProperty(username);
	},

	getNumUsers: function() {
		return Object.keys(this.users).length;
	}
};

module.exports = ChatRoom;