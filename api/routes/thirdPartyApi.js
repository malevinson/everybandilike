var Router = require('express').Router;
var thirdPartyApiHandler = require('../handlers/thirdPartyApi');

module.exports = function(app) {
    var router = new Router();

    router.route('/spotifyTopTracks')
        .get(thirdPartyApiHandler.spotifyTopTracks);
    router.route('/spotifyRelatedArtists')
        .get(thirdPartyApiHandler.spotifyRelatedArtists);
    router.route('/spotifyArtistById')
        .get(thirdPartyApiHandler.spotifyArtistById);
    router.route('/spotifySearchTrack')
        .get(thirdPartyApiHandler.spotifySearchTrack);
    router.route('/spotifySearchArtist')
        .get(thirdPartyApiHandler.spotifySearchArtist);
    router.route('/youtubeSearchForVideos')
        .get(thirdPartyApiHandler.youtubeSearchForVideos);
    router.route('/youtubeSearchForRelatedVideos')
        .get(thirdPartyApiHandler.youtubeSearchForRelatedVideos);
    app.use('/thirdPartyApi', router);
};