var debug = require('debug')('ebil:services:artist');

var Q = require('q');
var Artist = require('./../models/artist');

exports.saveArtist = function(artist) {
    var deferred = Q.defer();

    Artist.update({
        name: artist.name,
        spotifyId: artist.spotifyId,
        picture : artist.picture,
        genres : artist.genres
    }, {
        $set : {
            name: artist.name,
            spotifyId: artist.spotifyId,
            picture: artist.picture,
            genres : artist.genres
        }
    }, {
        upsert: true,
        _id: true
    }).exec()
        .then(function(object){
            if(object.upserted){
                return object.upserted[0];
            } else {
                return Artist.findOne({'spotifyId': artist.spotifyId},'_id').execQ()
            }
        })
        .then(function(artist){
            deferred.resolve(artist._id);
        });

    return deferred.promise;
};