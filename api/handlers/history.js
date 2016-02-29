var debug = require('debug')('streamfeed:handlers:history');

var historyService = require('../services/history');
var artistService = require('../services/artist');

var validationHandler = function(res, required_fields){ 
    res.status(500).send('Missing one or more Required Fields: '+ required_fields);
};

exports.addToHistory = function(req, res, next){
    var artist = req.body.artist;
    var user = req.body.user;
    var required_fields = 'user, artist';

    // validation & donot add artist without spotifyId
    if(user && user.length && typeof artist !== "undefined"){
        
        artist = typeof artist === "string" ? JSON.parse(artist) : artist;
        
        if(typeof artist.spotifyId !== "undefined" && artist.spotifyId !== null && artist.spotifyId !== '') {
            artistService.saveUserArtist(artist, user)
            .then(function(artistId) {
                historyService.addArtistToHistory(artistId, user)
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

exports.getUserHistory = function(req, res, next){
    var user = req.body.user;
    var required_fields = 'user';

    // validation
    if(user && user.length){
        historyService.getHistory(user)
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
    if(user && artist){
        historyService.removeArtistFromHistory(user, artist)
        .then(function(result){
            res.status(200).send(result);
        }, function(err){
            res.status(500).send(err);
        })

    } else validationHandler(res, required_fields);
};

exports.emptyHistory = function(req, res, next){
    var user = req.body.user;
    var required_fields = 'user';

    // validation
    if(user && user.length){
        historyService.emptyHistory(user)
        .then(function(result){
            res.status(200).send(result);
        }, function(err){
            res.status(500).send(err);
        })

    } else validationHandler(res, required_fields);
};