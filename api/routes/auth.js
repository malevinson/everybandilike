var debug = require('debug')('ebil:routes:auth');

var request = require('request');
var qs = require('querystring');
var User = require('./../models/user');
var userService = require('../services/user');

var config = require ('./../config');

module.exports = function(app) {

    app.post('/auth/facebook', function(req, res) {
        debug(`[POST] /auth/facebook`);
        var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
        var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
        var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
        var params = {
            code: req.body.code,
            client_id: req.body.clientId,
            client_secret: config.facebook_secret,
            redirect_uri: req.body.redirectUri
        };

        request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
            if (response.statusCode !== 200) {
                return res.status(500).send({message: accessToken.error.message});
            }

            request.get({url: graphApiUrl, qs: accessToken, json: true}, function (err, response, profile) {
                if (response.statusCode !== 200) {
                    return res.status(500).send({message: profile.error.message});
                }

                User.findOne({ facebookId: profile.id}, function (err, existingUser) {
                    if (existingUser) {
                        return res.send({ user: existingUser });
                    }

                    hash()
                        .then(function(hash){
                            var user = new User({
                                email : profile.email,
                                facebookId : profile.id,
                                picture : 'https://graph.facebook.com/' + profile.id + '/picture?type=large',
                                first_name : profile.first_name,
                                last_name : profile.last_name,
                                hash : hash
                            });

                            user.save(function () {
                                res.send({ user: user });
                            });

                        });
                });
            });
        });
    });

    app.post('/auth/twitter', function(req, res) {
        debug(`[POST] /auth/twitter`);
        var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
        var accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
        var profileUrl = 'https://api.twitter.com/1.1/users/show.json?screen_name=';

        // Part 1 of 2: Initial request from Satellizer.
        if (!req.body.oauth_token || !req.body.oauth_verifier) {
            var requestTokenOauth = {
                consumer_key: config.twitter_key,
                consumer_secret: config.twitter_secret,
                callback: req.body.redirectUri
            };

            // Step 1. Obtain request token for the authorization popup.
            request.post({ url: requestTokenUrl, oauth: requestTokenOauth }, function(err, response, body) {
                var oauthToken = qs.parse(body);

                // Step 2. Send OAuth token back to open the authorization screen.
                res.send(oauthToken);
            });
        } else {
            // Part 2 of 2: Second request after Authorize app is clicked.
            var accessTokenOauth = {
                consumer_key: config.twitter_key,
                consumer_secret: config.twitter_secret,
                token: req.body.oauth_token,
                verifier: req.body.oauth_verifier
            };

            // Step 3. Exchange oauth token and oauth verifier for access token.
            request.post({ url: accessTokenUrl, oauth: accessTokenOauth }, function(err, response, accessToken) {

                accessToken = qs.parse(accessToken);

                var profileOauth = {
                    consumer_key: config.twitter_key,
                    consumer_secret: config.twitter_secret,
                    oauth_token: accessToken.oauth_token
                };

                // Step 4. Retrieve profile information about the current user.
                request.get({
                    url: profileUrl + accessToken.screen_name,
                    oauth: profileOauth,
                    json: true
                }, function(err, response, profile) {

                    if (response.statusCode !== 200) {
                        return res.status(500).send({message: profile.error.message});
                    }

                    User.findOne({ twitterId: profile.id }, function(err, existingUser) {
                        if (existingUser) {
                            return res.send({ user: existingUser });
                        }
                        console.log('getting hash');
                        hash()
                            .then(function(hash){
                                console.log(hash);
                                var user = new User({
                                    twitterId : profile.id,
                                    first_name : profile.name,
                                    picture : profile.profile_image_url.replace('_normal', ''),
                                    hash : hash
                                });
                                console.log(user);

                                user.save(function () {
                                    res.send({ user: user });
                                });

                            });
                    });
                });
            });
        }
    });

    app.post('/auth/signup', function(req, res) {
        debug(`[POST] /auth/signup`);
        User.findOne({ email: req.body.signup_email }, function(err, existingUser) {
            if (existingUser) {
                return res.status(409).send({ message: 'Email is already taken' });
            }

            hash()
                .then(function(hash){
                    var user = new User({
                        first_name: req.body.firstName,
                        last_name : req.body.lastName,
                        email: req.body.signup_email,
                        password: req.body.password,
                        hash : hash
                    });

                    user.save(function(err, result) {
                        if (err) {
                            res.status(500).send({ message: err.message });
                        }
                        res.send({ user: user });
                    });

                });
        });
    });

    app.post('/auth/login', function(req, res) {
        debug(`[POST] /auth/login`);
        User.findOne({email: req.body.email}, '+password', function (err, user) {
            if (!user) {
                return res.status(401).send({message: 'Invalid email and/or password'});
            }
            user.comparePassword(req.body.password, function (isMatch) {
                if (!isMatch) {
                    return res.status(401).send({message: 'Invalid email and/or password'});
                }
                res.send({user: user});
            });
        });
    });

    app.get('/auth/user/:id', function(req, res) {
        debug(`[GET] /auth/user/${req.params.id}`);

        User.findOne({ _id: req.params.id}, function (err, user) {
            res.send(user);
        });
    });

    app.put('/auth/user/:id', function(req, res) {
        debug(`[PUT] /auth/user/${req.params.id}`);

        userService
            .update(req.params.id, req.body.data)
            .then(function(user) {
                res.status(200).send(user);
            })
            .catch(function(err) {
                res.status(400).send(err);
            });
    });
};

function hash(){
    var hash = '';
    return User.find().sort('-date').limit(10)
        .then(function(result){
            if (!result.length) {
                hash = 'aaa';
            } else {
                hash = increment(result[0].hash);
            }
            return hash;
        });
}

function increment(mostRecentUser) {
    var array1 = "abcdefghijklmnopqrstuzwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split('');
    var array2 = array1;
    var array3 = array1;

    mostRecentUser = mostRecentUser.split('');


    if (array1.indexOf(mostRecentUser[2]) != array1.length - 1)
    {
        mostRecentUser[2] = array1[array1.indexOf(mostRecentUser[2]) + 1];
    }

    else if (array1.indexOf(mostRecentUser[1]) != array1.length - 1)
    {
        mostRecentUser[1] = array1[array1.indexOf(mostRecentUser[1]) + 1];
        mostRecentUser[2] = array1[0];
    }

    else {
        mostRecentUser[2] = array1[0];
        mostRecentUser[1] = array1[0];
        mostRecentUser[0] = array1[array1.indexOf(mostRecentUser[0]) + 1];
    }
    
    return(mostRecentUser.join().replace(/,/g, ''));
}