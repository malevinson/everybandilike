var mongoose = require('mongoose-q')();
var Schema = mongoose.Schema;

var ApiDataSchema = new Schema({
    method: String,
    params: String,
    data: String,
    timestamp: "Date"
});

ApiDataSchema.set('versionKey', false);

module.exports = mongoose.model('ApiData', ApiDataSchema);