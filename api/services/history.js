var debug = require('debug')('streamfeed:services:history');
var Q = require('q');
var History = require('./../models/history');
var _ = require('lodash');
var utils = require('./../utils');
var ratingService = require('./rating');

var getHistory = function (userId, returnPopulated) {

   var deferred = Q.defer();
   var condition = {
      user: userId
   };
   var update = {};
   var options = {
      new: true,
      upsert: true
   };

   if (typeof returnPopulated === "undefined") {
      return History.findOneAndUpdate(condition, update, options)
         .exec();
   } else {
      History.findOneAndUpdate(condition, update, options)
         .populate('items.artist')
         .populate('items.rating', 'ratingGiven')
         .exec(function (err, result) {
            if (err) deferred.reject(err);
            else deferred.resolve(result);
         })
   }

   return deferred.promise;
};

// get history
exports.getHistory = function (userId) {
   return getHistory(userId, true);
};

// add to history
exports.addArtistToHistory = function (artistId, user) {
   var deferred = Q.defer();

   ratingService.getRate(user, artistId)
      .then(function (rating) {

         exports.removeArtistFromHistory(user, artistId)
            .then(function () {
               History.update(
                  {
                     user: user,
                     items: {
                        // update document if the request aritst isn't found.
                        $not: {
                           $elemMatch: {
                              artist: artistId
                           }
                        }
                     }
                  },
                  {
                     // add the artist to the start of the queue.
                     $push: {
                        items: {
                           $each:[
                              {artist: artistId.toString(),
                              rating: rating._id}
                           ],
                           $position: 0,
                           $slice:10
                        }
                     }
                  },
                  {
                     upsert: true,
                     new: true
                  },
                  function (err, rowsAffected) {
                     if (err && err.name == 'VersionError') {
                        deferred.reject(err);
                     }
                     else {
                        // get the latest history
                        exports.getHistory(user)
                           .then(function (history) {
                              deferred.resolve(history);
                           }, function (err) {
                              deferred.reject(err);
                           });
                     }
                  });
            })
      });

return deferred.promise;
};

// remove from history
exports.removeArtistFromHistory = function (user, artist) {
   var deferred = Q.defer();

   History.update({user:user},{$pull:{
      items:{
         artist:artist
      }
   }},function(err,saved){
      if(err) deferred.reject(err);
      else {
         exports.getHistory(user)
            .then(function(history){
               deferred.resolve(history);
            }, function(err){
               deferred.reject(err);
            })
      }
   });

   return deferred.promise;
};

// empty history
exports.emptyHistory = function (user) {
   var deferred = Q.defer();

   getHistory(user)
      .then(function (history) {

         history.items = [];

         history.save(function (err, saved) {
            if (err) deferred.reject(err);
            else {
               exports.getHistory(user)
                  .then(function (history) {
                     deferred.resolve(history);
                  }, function (err) {
                     deferred.reject(err);
                  })
            }
         });

      }, function (err) {
         deferred.reject(err);
      });

   return deferred.promise;
};