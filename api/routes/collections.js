var debug = require('debug')('ebil:routes:collections');

var request = require('request');
var User = require('./../models/user');

var config = require ('./../config');

module.exports = function(app) {

    app.get('/collections/latest', function(req, res) {
        debug(`[GET] /collections/latest`);

        User.find().sort('-created').limit(3)
            .then(function(result){
                var hash = [];
                result.forEach(function(user){
                    hash.push(user.hash);
                });
                res.status(200).send(hash);
            });
    });
    
};