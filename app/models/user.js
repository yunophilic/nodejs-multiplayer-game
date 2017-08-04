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
                    const VALID_USERNAME_REGEX = /^[\w.]+$/;
                    return VALID_USERNAME_REGEX.test(v);
                },
                message: 'Username can only contain alphanumeric characters, dots, and underscores.'
            },
            minlength: [5, '{VALUE} is shorter than the minimum length restriction ({MINLENGTH} characters).'],
            maxlength: [50, 'Username exceeds maximum length restriction ({MAXLENGTH} characters).'],
            trim: true,
            unique: true,
            required: [true, 'Username Required']
        },
        email        : {
            type: String,
            validate: {
                validator: function(v) {
                    const VALID_EMAIL_REGEX = /^[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+$/;
                    return VALID_EMAIL_REGEX.test(v);
                },
                message: '{VALUE} is not a valid email address (e.g. \'user@example.com\').'
            },
            maxlength: [200, 'Email exceeds maximum length restriction ({MAXLENGTH} characters).'],
            lowercase: true, 
            trim: true,
            unique: true,
            required: [true, 'Email Required']
        },
        password     : {
            type: String,
            validate: {
                validator: function(v) {
                    const VALID_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/;
                    return VALID_PASSWORD_REGEX.test(v);
                },
                message: 'Password must contain an uppercase letter, a lowercase letter, a number, and a special character.'
            },
            minlength: [6, 'Password must be at least {MINLENGTH} characters'],
            maxlength: [50, 'Password cannot exceed {MINLENGTH} characters'],
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
/*userSchema.methods.generateHash = function(password) {
    return ;
};*/

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.pre('save', function(next) {
    // let the password hashing be handled when saving to db
    // required to allow password restriction validation
    var user = this;
    var passwordPlainText = user.local.password;
    var passwordHash = bcrypt.hashSync(passwordPlainText, bcrypt.genSaltSync(8), null);
    user.local.password = passwordHash;

    next();
})

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
