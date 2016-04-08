var debug = require('debug')('ebil:handlers:rating');

var ratingService = require('../services/rating');
var artistService = require('../services/artist');

var validationHandler = function(res, required_fields){ 
    res.status(500).send('Missing one or more Required Fields: '+ required_fields);
};

exports.submitRating = function(req, res) {
    var rating = req.body.rating;
    var user = req.body.user;
    var artist = req.body.artist;   

    var required_fields = 'user, rating, artist';

   // validation & donot add artist without spotifyId
    if(user && user.length && artist && rating && rating > 0 && rating < 4 ){
        
        artist = typeof artist === "string" ? JSON.parse(artist) : artist;
        
        if(typeof artist.spotifyId !== "undefined" && artist.spotifyId !== null && artist.spotifyId !== '') {
            artistService
                .saveArtist(artist)
                .then(function(artist_id) {
                    return ratingService.updateOrInsertDB(artist_id, user, rating);
                })
                .then(function(results){
                    res.status(200).send(results);
                })
                .catch(function(err){
                    res.status(500).send(err);
                });
        }
        else validationHandler(res, required_fields);
        
    } else validationHandler(res, required_fields);
};

exports.getRatings = function(req, res) {
    debug(`[GET] /ratings/${req.params.hash}`);

    if (!req.params.hash || req.params.hash.length != 3) {
        validationHandler(res, 'hash')
    }

    ratingService
        .getRatings(req.params.hash)
        .then(function(artists){
            res.status(200).send(artists);
        })
        .catch(function(err){
            console.error(err);
            res.status(500).send(err);
        })
};

exports.deleteRatings = function(req, res, next){
    var user = req.body.user;
    var artist = req.body.artist; 

    var required_fields = 'user';

    // validation
    if(user && user.length){

        // delete
        ratingService.deleteRatings(user, artist).then(function(results){
            res.status(200).send(results);
        }, function(err){
            console.error(err);
            res.status(500).send(err);
        });
    } else validationHandler(res, required_fields);
};