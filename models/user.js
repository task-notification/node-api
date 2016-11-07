/**
 * USER Entity
 *
 * @author Michael Müller <development@reu-network.de>
 */

// load ORM
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

// create user schema
var UserSchema = new Schema({
    name: String,
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type:String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    admin: Boolean,
    created_at: Date,
    updated_at: Date
});

// on every save set updated_at and salt password
UserSchema.pre('save', function (next) {
    var user = this;
    var currentDate = new Date();

    // set updated_at date
    user.updated_at = currentDate;
    // if created_at doesn't exist, add to field
    if(!user.created_at)
        user.created_at = currentDate;

    // save salted password to database if modified
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

// compare salted passwords
UserSchema.methods.comparePassword = function (passwd, cb) {
    bcrypt.compare(passwd, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);