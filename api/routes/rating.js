var Router = require('express').Router;
var ratingHandler = require('../handlers/rating');

module.exports = function(app) {
    var router = new Router();

    router.route('/:hash')
        .get(ratingHandler.getRatings);
    
    router.route('/submit')
        .post(ratingHandler.submitRating);
    router.route('/delete')
        .post(ratingHandler.deleteRatings);    
    app.use('/rating', router);
};