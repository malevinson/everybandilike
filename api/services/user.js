var debug = require('debug')('streamfeed:services:user');

var Q = require('q');
var _ = require('lodash');
var User = require('./../models/user');

exports.update = function(userID, data) {
    return User.findOneQ({ _id: userID })
        .then(function(user) {
            _.assign(user, data);
            return user.saveQ();
        });
};

exports.updateUserArtists = function(userID, artistID){
    return User.findOne({_id: userID})
        .then(function(user){
            if(user.artists.indexOf(artistID.toString()) === -1){
                user.artists.push(artistID.toString());
            }
            return user.saveQ();
        });
};