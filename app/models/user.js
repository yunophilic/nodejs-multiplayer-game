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
                    const VALID_EMAIL_REGEX = /^[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+$/i;
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
                    if(!this.isModified('local.password')) {
                        return true;
                    }

                    console.log('validating pwd req');

                    const VALID_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).{6,50}$/;
                    return VALID_PASSWORD_REGEX.test(v);
                },
                message: 'Password must contain at least 6 characters, at most 50 characters, ' +
                    'an uppercase letter, a lowercase letter, a number, and a special character.'
            },
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
    var user = this;

    /*console.log(user.isModified('local.password'));
    console.log(user.isNew);*/

    // only hash the password if it has been modified or user is newly created
    if (user.isModified('local.password') || user.isNew) {
        console.log('hashing password');

        // let the password hashing be handled when saving to db
        // required to allow password restriction validation
        var passwordPlainText = user.local.password;
        var passwordHash = bcrypt.hashSync(passwordPlainText, bcrypt.genSaltSync(8), null);
        user.local.password = passwordHash;
    }

    next();
})

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
