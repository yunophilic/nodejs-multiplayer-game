var crypto = require('crypto');

module.exports = {
	secret: crypto.randomBytes(64).toString('hex')
}