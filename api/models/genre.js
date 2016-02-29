var mongoose = require('mongoose-q')();
var Schema = mongoose.Schema;

var GenreSchema = new Schema({
    name: String,
    artists: {type: Array},
    timestamp: "Date"
});

module.exports = mongoose.model('Genre', GenreSchema);