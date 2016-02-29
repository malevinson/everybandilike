var mongoose = require('mongoose-q')();
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: String,
    email: String,
    first_name: String,
    last_name : String,
    picture : String,
    password: { 
        type: String, 
        select: false, 
        validate: [
            function(password){
                return password.length >= 6
            }
        ]
    },
    facebookId: String,
    twitterId: String,

    tour : { type: Boolean, default: false }
},
{ 
    toJSON: {
        transform: function(doc, ret, options) {
            delete ret.password;
            delete ret.__v;
        }
    }
});

userSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(user.password, salt, function(err, hash) {
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(password, done) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        done(err, isMatch);
    });
};

module.exports = mongoose.model('User', userSchema);