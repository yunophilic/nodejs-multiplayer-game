var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

//constants
const AVATAR_DIR = './public/img/avatar';
const DEFAULT_AVATAR_PATH = './public/img/default-avatar.png';

//for encryption
var algorithm = 'aes-256-ctr';
var password = 'd6F3Efeq';

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
	},

	//reference: http://lollyrock.com/articles/nodejs-encryption/

	encrypt: function(text) {
		var cipher = crypto.createCipher(algorithm, password);
		var crypted = cipher.update(text,'utf8','base64');
		crypted += cipher.final('base64');
		return crypted;
	},

	decrypt: function(text) {
		var decipher = crypto.createDecipher(algorithm, password);
		var dec = decipher.update(text,'base64','utf8');
		dec += decipher.final('utf8');
		return dec;
	}	
}