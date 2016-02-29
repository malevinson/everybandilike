var Router = require('express').Router;
var historyHandler = require('../handlers/history');

module.exports = function(app) {
    var router = new Router();

    router.route('/add')
        .post(historyHandler.addToHistory);
    router.route('/get')
        .post(historyHandler.getUserHistory);
    router.route('/remove')
        .post(historyHandler.removeArtist);
    router.route('/empty')
        .post(historyHandler.emptyHistory);
    app.use('/history', router);
};