var debug = require('debug')('ebil:api');

var fs = require('fs');
var path = require('path');
var utils = require('./utils');

module.exports = function(app) {
    utils.readdirRecursiveSync(path.join(__dirname, 'routes')).forEach(function(route) {
        require(path.join(__dirname, 'routes', route))(app);
    });

    debug('Initializing routes');
};