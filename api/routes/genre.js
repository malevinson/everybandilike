var Router = require('express').Router;
var genreHandler = require('../handlers/genre');

module.exports = function(app) {
    var router = new Router();
    
    router.route('/topArtists/')
        .get(genreHandler.topArtists);

    app.use('/genre', router);
};