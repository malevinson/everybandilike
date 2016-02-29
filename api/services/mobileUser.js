var debug = require('debug')('streamfeed:services:MobileUser');

var Q = require('q');
var _ = require('lodash');
var MobileUser = require('./../models/mobileUser');

exports.saveEmail = function (email) {
    var deferred = Q.defer();

    MobileUser.findOneAndUpdate(
        { email:email },
        
        {
            $setOnInsert: {
                email : email
            }   
        },
        
        {
            upsert:true,
            new:true,
        },

        function(err,doc){
            if(err){
                deferred.reject(err);
            }else {
                deferred.resolve(doc);
            }
        }
    )

    return deferred.promise;

}
