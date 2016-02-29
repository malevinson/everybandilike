var mongoose = require('mongoose-q')();
var Schema = mongoose.Schema;

var QueueSchema = new Schema({
	user :  { type: Schema.ObjectId, ref : 'User' },
	items: [{
	    artist : {type: Schema.ObjectId, ref: 'Artist'},
	    rating : {type : Schema.ObjectId, ref: 'Rating'},
	    artistOnly : {type: Boolean, default: false}
	}]
});

module.exports = mongoose.model('Queue', QueueSchema );