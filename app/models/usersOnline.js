//Reference: https://stackoverflow.com/questions/41022080/working-with-multiple-tabs-with-socket-io

function UsersOnline(){
	this.users = {}; //hash table of (username, tabs) entry to handle multiple tabs
}

UsersOnline.prototype = {
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

		// decrement reference count for this user
		// and remove user if reference count hits zero
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
	}
};

module.exports = UsersOnline;