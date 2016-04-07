var querystring = require('querystring');
var https = require('https');
var Q = require('q');

exports.performRequest = function (host, endpoint, method, data) {
    var deferred = Q.defer();
    var dataString = JSON.stringify(data);
    var headers = {};

    if (method == 'GET') {
        endpoint += '?' + querystring.stringify(data);
    } else {
        headers = {
            'Content-Type': 'application/json',
            'Content-Length': dataString.length
        };
    }
    var options = {
        host: host,
        path: endpoint,
        method: method,
        headers: headers
    };

    var req = https.request(options, function (res) {
        res.setEncoding('utf-8');

        var responseString = '';

        res.on('data', function (data) {
            responseString += data;
        });

        res.on('end', function () {
            var responseObject = JSON.parse(responseString);
            deferred.resolve(responseObject);
        });
    });

    req.write(dataString);
    req.end();

    return deferred.promise
};