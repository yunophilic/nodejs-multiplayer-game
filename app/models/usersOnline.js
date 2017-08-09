var User = require('./user');

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

		//update user status in db to online
		updateUserDb(username, true);

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

				//update user status in db to offline
				updateUserDb(username, false);
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

function updateUserDb(username, online) {
	User.findOne({ 'local.username': username }, function(err, user) {
		if(err || !user) {
			//this generally shouldn't happen if username cannot be changed
			/*console.log('error retrieving user');*/
			var err = new Error('Not Found');
			err.status = 404;
			return false;
		}
		user.online = online;
		user.save();
		return true;
	});
}