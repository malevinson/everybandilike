var debug = require('debug')('streamfeed:handlers:queue');

var queueService = require('../services/queue');
var artistService = require('../services/artist');

var validationHandler = function(res, required_fields){ 
    res.status(500).send('Missing one or more Required Fields: '+ required_fields);
};

exports.addToQueue = function(req, res, next){
    var artist = req.body.artist;
    var isArtistOnly = req.body.artistOnly;
    var user = req.body.user;
    var required_fields = 'user, artist';

    // validation & donot add artist without spotifyId
    if(user && user.length && artist){
        
        artist = typeof artist === "string" ? JSON.parse(artist) : artist;
        
        if(typeof artist.spotifyId !== "undefined" && artist.spotifyId !== null && artist.spotifyId !== '') {
            artistService.saveUserArtist(artist, user)
            .then(function(artistId) {
                queueService.addArtistToQueue(artistId, user, isArtistOnly)
                .then(function(result){
                    res.status(200).send(result);
                }, function(err){
                    res.status(500).send(err);
                });
            });
        }
        else validationHandler(res, required_fields);

    } else validationHandler(res, required_fields);
};

exports.getUserQueue = function(req, res, next){
    var user = req.body.user;
    var required_fields = 'user';

    // validation
    if(user && user.length){
        queueService.getQueue(user)
        .then(function(result){
            res.status(200).send(result);
        },function(result){
            res.status(500).send(result);
        });

    } else validationHandler(res, required_fields);
};

exports.removeArtist = function(req, res, next){
    var artist = req.body.artist;
    var user = req.body.user;
    var required_fields = 'user, artist';

    // validation
    if(user && user.length && artist){
        queueService.removeArtistFromQueue(user, artist)
        .then(function(result){
            res.status(200).send(result);
        }, function(err){
            res.status(500).send(err);
        })

    } else validationHandler(res, required_fields);
};

exports.emptyQueue = function(req, res, next){
    var user = req.body.user;
    var required_fields = 'user';

    // validation
    if(user && user.length){
        queueService.emptyQueue(user)
        .then(function(result){
            res.status(200).send(result);
        }, function(err){
            res.status(500).send(err);
        })

    } else validationHandler(res, required_fields);
};

exports.moveArtist = function(req, res, next){
    var user = req.body.user;
    var from = req.body.from;
    var to = req.body.to;
    var required_fields = 'user, from, to';

    // validation
    if(user && user.length && typeof from!== "undefined" && typeof to !== "undefined"){
        queueService.moveArtist(user, from, to)
        .then(function(result){
            res.status(200).send(result);
        }, function(err){
            res.status(500).send(err);
        })
    } else validationHandler(res, required_fields);
};