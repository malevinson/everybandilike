require('dotenv').load({ silent: true });
process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase() : "development"; 

var debug = require('debug')('ebil:app');

// Libs
var express = require('express');
var enforce = require('express-sslify');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
var colors = require('colors');

var config = require('./api/config');
var server = express();

mongoose.connect(config.mongo_uri);
var db = mongoose.connection;
db.once('open', function() {
    debug(`Initialized db connection`.magenta);
});

server.set('port', (process.env.PORT || 8000));
server.set('x-powered-by', false);

if(process.env.NODE_ENV.toLowerCase() == "production") {
    server.use(enforce.HTTPS({ trustProtoHeader: true }));
}

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(function(req, res, next){
    debug(`[${req.method}] ${req.url}`);
    next();
});

server.use(express.static(`${__dirname}/front/dist`));
server.get([
    '/',
    '/login',
    '/main',
    '/share'
], function(req, res) {
    res.sendFile(`${__dirname}/front/dist/index.html`);
});

require('./api')(server);

server.use(function(req, res, next) {
    debug(`UNRESOLVED: [${req.method}] ${req.headers.host}${req.url}`.red);
    next();
});

server.listen(server.get('port'), function () {
    debug(`Server listening on port ${server.get('port')}`.green);
    debug('Environment is ' + server.get('env'));
});