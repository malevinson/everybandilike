var debug = require('debug')('soundcapsule:routes:mobileUser');

var Router = require('express').Router;
var mobileUserHandler = require('../handlers/mobileUser');

module.exports = function(app) {
    var router = new Router();

    router.route('/saveEmail')
        .post(mobileUserHandler.saveEmail);

    app.use('/mobileUser', router);
};