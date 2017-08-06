var fs = require('fs');
var path = require('path');

//constants
const AVATAR_DIR = './public/img/avatar';
const DEFAULT_AVATAR_PATH = './public/img/default-avatar.png';

module.exports = {
	getRandomInt: function (min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	},
	getUserAvatarPath: function(userIdStr) {
		var avatarName = null

		if (fs.existsSync(AVATAR_DIR)) {
			fs.readdirSync(AVATAR_DIR).forEach(function(x) {
				if (x.startsWith(userIdStr)) {
					avatarName = x;
				}
			});
		}

		var imgPath = avatarName != null ?
			path.resolve(AVATAR_DIR, avatarName) :
			path.resolve(DEFAULT_AVATAR_PATH);

		return imgPath;
	}
}