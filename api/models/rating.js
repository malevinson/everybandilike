var mongoose = require('mongoose-q')();
var Schema = mongoose.Schema;

var RatingSchema = new Schema({
	user :  { type: Schema.ObjectId, ref : 'User' },
	artist : { type: Schema.ObjectId, ref : 'Artist' },
	ratingGiven : { type: 'Number', default: 0},
	timestamp : { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rating', RatingSchema );