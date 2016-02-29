var debug = require('debug')('streamfeed:services:history');
var Q = require('q');
var Genre = require('./../models/genre');
var http = require('http');

var config = require('./../config');

exports.top = function(genre, limit) {
    var deferred = Q.defer();
    var last90Day = new Date();
    last90Day.setDate(last90Day.getDate()-90);

    Genre.findOne({
            name:genre,
            timestamp: {$gt:last90Day}
        }, function(err, genreData) {
                if(genreData) {
                    deferred.resolve(genreData.artists);
                } else {
                    var url = `http://developer.echonest.com/api/v4/genre/artists?api_key=${config.echonest_key}&format=json`;
                    url = url + `&results=${limit}`;
                    url = url + '&bucket=' + 'familiarity_rank';
                    url = url + '&name=' + encodeURIComponent(genre);

                    var req = http.get(url, function (res) {
                        // Buffer the body entirely for processing as a whole.
                        
                        var bodyChunks = [];
                        
                        res.on('data', function (chunk) {
                            //Process streaming data here..
                            bodyChunks.push(chunk);
                        }).on('end', function () {
                            var body = JSON.parse(Buffer.concat(bodyChunks));
                            //Process the entire data here...

                            //sort by familiarity
                            var artists = body.response.artists;

                            if(artists) {
                                artists.sort(function (a, b) {
                                    if (a.familiarity_rank < b.familiarity_rank) {
                                        return -1;
                                    }
                                    if (a.familiarity_rank > b.familiarity_rank) {
                                        return +1;
                                    }
                                    return 0;
                                });

                                var genreData = new Genre();

                                genreData.name = genre;
                                genreData.artists = artists;
                                genreData.timestamp = new Date();

                                genreData.save(function (err) {
                                    if(!err) {
                                        deferred.resolve(artists);
                                    } else {
                                        deferred.reject('Failed to save genre data');
                                    }
                                })
                            } else {
                                deferred.reject("Failed to fetch artist for genre," + genre);
                            }
                        })
                    });

                    req.on('error', function (e) {
                        deferred.reject(e.message);
                    });
                }
            });

    return deferred.promise;
};