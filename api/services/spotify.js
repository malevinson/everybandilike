var debug = require('debug')('streamfeed:services:spotify');

var Q 	=   require('q');
var _ = require('lodash');
var apiCall = require('../helpers/apiCall');
var ApiData = require('./../models/apiData');

var SpotifyHost = 'api.spotify.com';

exports.spotifyTopTracks = function(artistId) {
    var deferred = Q.defer();
    var last90Day = new Date();
    last90Day.setDate(last90Day.getDate() - 90);

    ApiData.findOne({
        'method': 'spotifyTopTracks',
        params: artistId,
        timestamp: {$gt: last90Day}
    }).execQ().then(function (result) {
        if (result != null && !JSON.parse(result.data).error) {
            var responseObject = JSON.parse(result.data);
            deferred.resolve(responseObject)
        } else {
            apiCall.performRequest(SpotifyHost, '/v1/artists/' + artistId + '/top-tracks', 'GET', {country: 'US'})
                .then(function (data) {
                    var apiData = new ApiData({
                        method: 'spotifyTopTracks',
                        params: artistId,
                        timestamp: new Date(),
                        data: JSON.stringify(data)
                    });
                    apiData.saveQ();
                    deferred.resolve(JSON.stringify(data))
                }, function (err) {
                    console.log("Error is: ", err);
                    deferred.reject(err)
                })
        }
    });
    return deferred.promise
};

exports.spotifyRelatedArtists = function(artistId) {
    var deferred = Q.defer();
    var last90Day = new Date();
    last90Day.setDate(last90Day.getDate() - 90);

    ApiData.findOne({
        'method': 'spotifyRelatedArtists',
        params: artistId,
        timestamp: {$gt: last90Day}
    }).execQ().then(function (result) {
        if (result != null && !JSON.parse(result.data).error) {
            var responseObject = JSON.parse(result.data);
            deferred.resolve(responseObject)
        } else {
            apiCall.performRequest(SpotifyHost, '/v1/artists/' + artistId + '/related-artists', 'GET', {country: 'US'})
                .then(function (data) {
                    var apiData = new ApiData({
                        method: 'spotifyRelatedArtists',
                        params: artistId,
                        timestamp: new Date(),
                        data: JSON.stringify(data)
                    });
                    apiData.saveQ();
                    deferred.resolve(JSON.stringify(data))
                }, function (err) {
                    console.log("Error is: ", err);
                    deferred.reject(err)
                })
        }
    });
    return deferred.promise
};

exports.spotifyArtistById = function(artistId) {
    var deferred = Q.defer();
    var last90Day = new Date();
    last90Day.setDate(last90Day.getDate() - 90);

    ApiData.findOne({
        'method': 'spotifyArtistById',
        params: artistId,
        timestamp: {
            $gt: last90Day
        }
    }).execQ()
        .then(function (result) {
            if (result != null && !JSON.parse(result.data).error) {
                var responseObject = JSON.parse(result.data);
                deferred.resolve(responseObject)
            } else {
                apiCall.performRequest(SpotifyHost, `/v1/artists/${artistId}`, 'GET', { country: 'US' })
                    .then(function (data) {
                        var apiData = new ApiData({
                            method: 'spotifyArtistById',
                            params: artistId,
                            timestamp: new Date(),
                            data: JSON.stringify(data)
                        });
                        apiData.saveQ();
                        deferred.resolve(data)
                    })
                    .catch(function (err) {
                        console.log(err);
                        deferred.reject(err)
                    })
            }
        });

    return deferred.promise
};

exports.spotifySearchTrack = function(SearchText) {
    var deferred = Q.defer();
    var last90Day = new Date();
    last90Day.setDate(last90Day.getDate() - 90);

    ApiData.findOne({
        'method': 'spotifySearchTrack',
        params: SearchText,
        timestamp: {$gt: last90Day}
    }).execQ().then(function (result) {
        if (result != null && !JSON.parse(result.data).error) {
            var responseObject = JSON.parse(result.data);
            deferred.resolve(responseObject)
        }
        else {
            apiCall.performRequest(SpotifyHost, '/v1/search', 'GET', {
                    q: SearchText,
                    type: 'track',
                    limit: 8,
                    country: 'US'
                })
                .then(function (data) {
                    var apiData = new ApiData({
                        method: 'spotifySearchTrack',
                        params: SearchText,
                        timestamp: new Date(),
                        data: JSON.stringify(data)
                    });
                    apiData.saveQ();
                    deferred.resolve(JSON.stringify(data))
                }, function (err) {
                    console.log("Error is: ", err);
                    deferred.reject(err)
                })
        }
    });
    return deferred.promise
};

exports.spotifySearchArtist = function(SearchText) {
    var deferred = Q.defer();
    var last90Day = new Date();
    last90Day.setDate(last90Day.getDate() - 90);

    ApiData.findOne({
        'method': 'spotifySearchArtist',
        params: SearchText,
        timestamp: {$gt: last90Day}
    }).execQ().then(function (result) {
        if (result != null && !JSON.parse(result.data).error) {
            var responseObject = JSON.parse(result.data);
            deferred.resolve(responseObject)
        }
        else {
            apiCall.performRequest(SpotifyHost, '/v1/search', 'GET', {q: SearchText, type: 'artist', country: 'US'})
                .then(function (data) {
                    var apiData = new ApiData({
                        method: 'spotifySearchArtist',
                        params: SearchText,
                        timestamp: new Date(),
                        data: JSON.stringify(data)
                    });
                    apiData.saveQ();
                    deferred.resolve(JSON.stringify(data))
                }, function (err) {
                    console.log("Error is: ", err);
                    deferred.reject(err)
                })
        }
    });
    return deferred.promise
};

exports.spotifyGetYears = function(artistId) {
    var deferred = Q.defer();
    var last90Day = new Date();
    last90Day.setDate(last90Day.getDate() - 90);

    ApiData.findOne({
        'method': 'spotifyGetYears',
        params: artistId,
        timestamp: {
            $gt: last90Day
        }
    }).execQ()
        .then(function (result) {
            if (result != null && !JSON.parse(result.data).error) {
                var responseObject = JSON.parse(result.data);
                deferred.resolve(responseObject)
            } else {
                apiCall.performRequest(SpotifyHost, `/v1/artists/${artistId}/albums`, 'GET', { country: 'US' })
                    .then(function (data) {
                        var albums = [];
                        data.items.forEach(function(el){
                            albums.push(el.id);
                        });

                        var query = JSON.stringify(albums).replace(/"/g,"");
                        query = query.slice(1, query.length-1);

                        return apiCall.performRequest(SpotifyHost, '/v1/albums', 'GET', {
                            ids: query,
                            type: 'album',
                            country: 'US'
                        });
                    })
                    .then(function (data) {
                        var dates = [];
                        data.albums.forEach(function(el){
                            dates.push(el.release_date.slice(0, 4));
                        });

                        dates = _.min(dates) + '-' + _.max(dates);

                        var apiData = new ApiData({
                            method: 'spotifyGetYears',
                            params: artistId,
                            timestamp: new Date(),
                            data: JSON.stringify(dates)
                        });
                        apiData.saveQ();

                        return deferred.resolve(dates)
                    })
                    .catch(function (err) {
                        console.log("Error is: ", err);
                        deferred.reject(err)
                    });
            }
        });

    return deferred.promise
};