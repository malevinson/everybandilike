var debug = require('debug')('streamfeed:services:queue');

var Q = require('q');
var Queue = require('./../models/queue');
var _ = require('lodash');
var utils = require('./../utils');
var ratingService = require('./rating');

var getQueue = function(userId, returnPopulated){

    var deferred = Q.defer();
    var condition = {
        user: userId
    };
    var update = { };
    var options = {
        new: true,
        upsert : true
    };

    if(typeof returnPopulated === "undefined"){
        return Queue.findOneAndUpdate(condition, update, options)
        .exec();
    } else {
        Queue.findOneAndUpdate(condition, update, options)
        .populate('items.artist')
        .populate('items.rating', 'ratingGiven')
        .exec(function(err, result){
            if(err) {
                deferred.reject(err);
            }

            else deferred.resolve(result);
        })
    }

    return deferred.promise;
};

// get queue
exports.getQueue = function(userId){
    return getQueue(userId, true);
};

// add to queue
exports.addArtistToQueue = function(artistId, user, isArtistOnly){
    var deferred = Q.defer();

    ratingService.getRate(user, artistId)
    .then(function(rating){


        /* 
            if encounters two parallel requests then remove the artist 
            if it is being already added by the first request.
        */
        exports.removeArtistFromQueue(user,artistId)
        .then(function() {
            Queue.update(
                {
                    user:user,
                    items:{
                        // update document if the request aritst isn't found.
                        $not:{                      
                            $elemMatch:{
                                artist:artistId
                            }
                        }
                    }                
                },
                {   
                    // add the artist to the end of the queue.
                    $push : {                      
                        items : {
                            artist: artistId.toString(),
                            rating : rating._id,
                            artistOnly : isArtistOnly ? isArtistOnly : false
                        }
                    }
                },{
                    upsert : true,
                    new : true
                },function (err,rowsAffected) {
                    if(err && err.name == 'VersionError') {
                        deferred.resolve(Queue);
                    }
                    else {
                        // get the latest queue
                        exports.getQueue(user)
                        .then(function(queue){     
                            deferred.resolve(queue);
                        }, function(err){
                            deferred.reject(err);
                        })
                    }
                })
        })  
    }, function(err){
        deferred.reject(err);
    });
    
    return deferred.promise;
};

// remove from queue
exports.removeArtistFromQueue = function(user, artist){
    var deferred = Q.defer();

        Queue.update({user:user},{$pull:{
            items:{
                artist:artist
            }
        }},function(err,saved){
            if(err) deferred.reject(err);
            else {
                exports.getQueue(user)
                .then(function(queue){
                    deferred.resolve(queue);
                }, function(err){
                    deferred.reject(err);
                })
            }
        });
    return deferred.promise;
};

// empty queue
exports.emptyQueue = function(user){
    var deferred = Q.defer();

    getQueue(user)
    .then(function(queue){
        
        queue.items= [];
        
        queue.save(function(err, saved){
            if(err) deferred.reject(err);
            else {
                exports.getQueue(user)
                .then(function(queue){
                    deferred.resolve(queue);
                }, function(err){
                    deferred.reject(err);
                })
            }
        });  
       
    }, function(err){
        deferred.reject(err);
    });
    
    return deferred.promise;
};

// move aritst to position
exports.moveArtist = function(user, old_position, new_position){
    var deferred = Q.defer();

    getQueue(user)
    .then(function(queue){
        
        queue.items = queue.items? queue.items : [];
        
        queue.items = utils.moveArray(queue.items, old_position, new_position)

        queue.save(function(err, saved){
            if(err) deferred.reject(err);
            else {
                exports.getQueue(user)
                .then(function(queue){
                    deferred.resolve(queue);
                }, function(err){
                    deferred.reject(err);
                })
            }
        });  
       
    }, function(err){
        deferred.reject(err);
    });


    return deferred.promise;
}