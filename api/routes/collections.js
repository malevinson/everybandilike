var debug = require('debug')('ebil:routes:collections');

var request = require('request');
var User = require('./../models/user');
var Ratings = require('./../models/rating');

var config = require ('./../config');

module.exports = function(app) {

    app.get('/collections/latest', function(req, res) {
        debug(`[GET] /collections/latest`);

        var hash = [];
        var counter = 1;

        getUser();

        function getUser() {
            var user;

            if (hash.length < 3) {
                User.find().sort('-created').limit(counter)
                    .then(function (result) {
                        user = result[counter-1];
                        counter++;

                        return Ratings.find({ user: user._id })
                    })
                    .then(function (ratings) {
                        if (ratings.length != 0) {
                            hash.push(user.hash);
                        }
                        getUser();
                    });
            } else {
                res.status(200).send(hash);
            }
        }
    });
    
};