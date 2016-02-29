var mongoose = require('mongoose-q')();
var Schema = mongoose.Schema;

var ArtistSchema = new Schema({
    name: String,
    spotifyId: String,
    picture : String,
    genres : [String],
    releases : String
});

module.exports = mongoose.model('Artist', ArtistSchema);