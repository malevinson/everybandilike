var debug = require('debug')('streamfeed:services:artist');

var Q = require('q');
var User = require('./../models/user');
var Artist = require('./../models/artist');
var userService = require('./user');
var SpotifyService = require('./spotify.js');

exports.getUserArtists = function(id) {
    return User.findOne({ _id: id }, 'artists').execQ()
        .then(function(artistInfo) {
            var artistIds = artistInfo.artists;
            return Artist.find({'_id':{$in: artistIds}}).execQ().then(function(result){
                return result;
            })
        });
};

exports.getUserHistory = function(id) {
    return User.findOne({ _id: id }, 'history').execQ()
        .then(function(artistInfo) {
            var artistIds = artistInfo.history;
            return Artist.find({'_id':{ $in: artistIds }}).execQ().then(function(result){
                return result;
            })
        });
};

exports.saveUserArtists = function(artists, userID) {
    return exports.createOrUpdateArtists(artists)
    .then(function(artistIds){
            return userService.update(userID, {artists: artistIds})
                .then(function (user) {
                    return user;
                });
        });
};

exports.saveUserArtist = function(artist, userID) {
    var deferred = Q.defer();

    exports.createOrUpdateArtist(artist, function(artistId){        
        deferred.resolve(artistId);
    });

    return deferred.promise;
};

exports.saveUserHistory = function(artists, userID) {
    return exports.createOrUpdateArtists(artists)
        .then(function(artistIds){
            return userService.update(userID, { history: artistIds })
                .then(function (user) {
                    return user;
                });
        });
};

exports.saveNewArtists = function(artists, user) {
    return exports.createOrUpdateArtists(artists)
    .then(function(artistIds){
            user.artists.push(artistIds);
            user.save();
            return user;
        });
};

exports.getArtistById = function(id) {
    return Artist.findOne({'_id': id}).execQ().then(function(result){
        return result;
    });
};

exports.createOrUpdateArtist = function(artist, callback) {
    return SpotifyService
        .spotifyGetYears(artist.spotifyId)
        .then(function(years){
            Artist.update({
                name: artist.name,
                spotifyId: artist.spotifyId,
                picture : artist.picture,
                genres : artist.genres,
                releases : years
            }, {
                $set : {
                    name: artist.name,
                    spotifyId: artist.spotifyId,
                    picture: artist.picture,
                    genres : artist.genres,
                    releases : years
                }
            }, {
                upsert: true,
                _id: true
            }).exec()
                .then(function(object){
                    if(object.upserted){
                        callback(object.upserted[0]._id);
                    } else {
                        Artist.findOne({'spotifyId': artist.spotifyId},'_id').execQ()
                            .then(function(result){
                                callback(result._id);
                            });
                    }
                });
        })
};

exports.createOrUpdateArtists = function(artists){
    var newArtistIds = [];
    artists.forEach(function(artist){
        var deffered = Q.defer();
        exports.createOrUpdateArtist(artist, function(result){
            deffered.resolve(result);
        });
        newArtistIds.push(deffered.promise);
    });
    return Q.all(newArtistIds);
};