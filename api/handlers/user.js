var userService = require('../services/user');
var _ = require('lodash');

exports.update = function(req, res, next) {
    var userID = req.body.userID;
    var updateData = req.body.data;

    userService.update(userID, updateData)
        .then(function(user) {
            res.status(200).send(user);
        })
        .catch(function(err) {
            res.status(400).send();
        });
};