var debug = require('debug')('ebil:services:rating');

var Q = require('q');
var Rating = require('./../models/rating');
var User = require('./../models/user');

// get ratings
exports.getRate = function(user, artist){
    
    var deferred = Q.defer();
    var conditions = {
        user: user
    };

    // check if artist is present
    if(typeof artist !== "undefined") conditions["artist"] = artist;

    var update = { };
    
    var options = {
        new: true,
        upsert : true
    };

    Rating.findOneAndUpdate(conditions, update, options)
    .populate('artist')
    .exec(function(err, result){
        if(err) deferred.reject(err);
        else deferred.resolve(result);
    });

    return deferred.promise;
};

exports.getRatings = function(hash){
    var deferred = Q.defer();

    User
        .findOne({ hash : hash })
        .then(function(user){
            return Rating.find({ user : user._id }).populate('artist')
        })
        .then(function(result){
            deferred.resolve(result)
        })
        .catch(function(err){
            deferred.reject(err)
        });

    return deferred.promise;
};

exports.updateOrInsertDB = function(artist, user, rating){
    debug('updateOrInsertDB');

    var deferred = Q.defer();

    var conditions = { artist : artist, user : user };
    var update = { ratingGiven : rating };
    var options = { new: true, upsert: true };

    Rating
        .findOneAndUpdate(conditions, update, options)
        .populate('artist')
        .exec(function(err, result){
            if (err) deferred.reject(err);
            else deferred.resolve(result);
        });

    return deferred.promise;
};

exports.deleteRatings = function(user, artist, rating){
    var deferred = Q.defer();

    var conditions = { user : user };

    // check if artist is present
    if(typeof artist !== "undefined") conditions["artist"] = artist;

    Rating.remove(conditions, function(err){
        if (err) deferred.reject(err);
        else deferred.resolve({
            message: "success"
        });
    });

    return deferred.promise;
};