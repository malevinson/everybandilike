var debug = require('debug')('ebil:config');

var config = {
    mongo_uri : process.env.MONGOLAB_URI,
    facebook_id : process.env.FACEBOOK_ID,
    facebook_secret : process.env.FACEBOOK_SECRET,
    twitter_key : process.env.TWITTER_KEY,
    twitter_secret : process.env.TWITTER_SECRET,
    twitter_token_secret : process.env.TWITTER_TOKEN_SECRET,
    env : process.env.NODE_ENV || 'local'
};

module.exports = config;