var mongoose = require('mongoose-q')();
var md5 = require('md5');
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

    user.password = md5(user.password);
    next();
});

userSchema.methods.comparePassword = function(password, done) {
    if (md5(password) == this.password) {
        done(true);
    } else {
        done(false);
    }
};

module.exports = mongoose.model('User', userSchema);