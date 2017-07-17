var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
	username: String,
	email: String,
	dob: { type: Date, default: Date.now }
});
mongoose.model('User', userSchema);