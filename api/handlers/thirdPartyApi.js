var debug = require('debug')('ebil:handlers:thirdPartyApi');

var spotifyService = require('../services/spotify');
var youtubeService = require('../services/youtube');
var apiCall = require('../helpers/apiCall');

exports.spotifyTopTracks = function(req, res, next) {
    var param = req.query.param;
    spotifyService.spotifyTopTracks(param)
        .then(function(data) {
            res.status(200).send(data);
        });
};

exports.spotifyRelatedArtists = function(req, res, next) {
    var param = req.query.param;
    spotifyService.spotifyRelatedArtists(param)
        .then(function(data) {
            res.status(200).send(data);
        });
};

exports.spotifyArtistById = function(req, res, next) {
    var param = req.query.param;
    spotifyService.spotifyArtistById(param)
        .then(function(data) {
            res.status(200).send(data);
        });
};

exports.spotifySearchTrack = function(req, res, next) {
    var param = req.query.param;
    spotifyService.spotifySearchTrack(param)
        .then(function(data) {
            res.status(200).send(data);
        });
};

exports.spotifySearchArtist = function(req, res, next) {
    var param = req.query.param;
    spotifyService.spotifySearchArtist(param)
        .then(function(data) {
            res.status(200).send(data);
        });
};
exports.youtubeSearchForVideos = function(req, res, next) {
    var param = req.query.param;
    youtubeService.youtubeSearchForVideos(param)
        .then(function(data) {
            res.status(200).send(data);
        });
};

exports.youtubeSearchForRelatedVideos = function(req, res, next) {
    var param = req.query.param;
    youtubeService.youtubeSearchForRelatedVideos(param)
        .then(function(data) {
            res.status(200).send(data);
        });
};