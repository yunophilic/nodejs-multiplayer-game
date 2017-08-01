module.exports = {
	buildErrorResponse: function (res) {
		res.status(500)
		var err = new Error('Error sending friend request');
		err.status = 500;
		res.json({message : err.status	+ ' ' + err});
	}
}