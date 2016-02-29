var mongoose = require('mongoose-q')();
var Schema = mongoose.Schema;

var HistorySchema = new Schema({
	user :  { type: Schema.ObjectId, ref : 'User' },
	items: [{
	    artist : {type: Schema.ObjectId, ref: 'Artist'},
	    rating : {type : Schema.ObjectId, ref: 'Rating'}
	}],
});

module.exports = mongoose.model('History', HistorySchema );