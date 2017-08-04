// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    local            : {
        username     : {
            type: String,
            validate: {
                validator: function(v) {
                    const VALID_USERNAME_REGEX = /\A(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])\z/;
                    return VALID_USERNAME_REGEX.test(v);
                },
                message: '{VALUE} can only contain alphanumeric characters, dots, and underscores!'
            },
            maxlength: 50,
            trim: true,
            unique: true,
            required: [true, 'Username Required']
        },
        email        : {
            type: String,
            validate: {
                validator: function(v) {
                    const VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i;
                    return VALID_EMAIL_REGEX.test(v);
                },
                message: '{VALUE} is not a email address!'
            },
            maxlength: 200,
            lowercase: true, 
            trim: true,
            unique: true,
            required: [true, 'Email Required']
        },
        password     : {
            type: String,
            required: [true, 'Password Required']
        }
    },

    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },

    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },

    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },

	friends: [String],
    friendRequests: [String],

    /*img: {
        data: Buffer,
        contentType: String
    }*/
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
