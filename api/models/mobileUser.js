var mongoose = require('mongoose-q')();
var Schema = mongoose.Schema;

var MobileUserSchema = new Schema({
    email: String
});

module.exports = mongoose.model('MobileUser', MobileUserSchema);