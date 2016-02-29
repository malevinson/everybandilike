var Router = require('express').Router;
var queueHandler = require('../handlers/queue');

module.exports = function(app) {
    var router = new Router();

    router.route('/add')
        .post(queueHandler.addToQueue);
    router.route('/get')
        .post(queueHandler.getUserQueue);
    router.route('/remove')
        .post(queueHandler.removeArtist);
    router.route('/empty')
        .post(queueHandler.emptyQueue);
	router.route('/move')
		.post(queueHandler.moveArtist);
    app.use('/queue', router);
};