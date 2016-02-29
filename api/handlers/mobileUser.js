var mobileUserService = require('../services/mobileUser');

exports.saveEmail = function(req, res, next) {
    var email = req.body.email;

    mobileUserService.saveEmail(email)
        .then(function(doc) {
            res.status(200).send(doc);
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
};