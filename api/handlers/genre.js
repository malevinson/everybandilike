var debug = require('debug')('streamfeed:handlers:genre');
var genreService = require('../services/genre');

exports.topArtists = function(req, res, next) {
    var genre = req.query.genre;
    var limit = req.query.limit;

    genreService.top(genre, limit)
        .then(function(jsonData) {
            res.status(200).send(jsonData);
        },function(err){
            res.status(500).send(err)
        })
};