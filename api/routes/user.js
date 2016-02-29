var debug = require('debug')('soundcapsule:routes:user');

var Router = require('express').Router;
var userHandler = require('../handlers/user');

module.exports = function(app) {
    var router = new Router();

    router.route('/')
        .put(userHandler.update);

    app.use('/user', router);
};