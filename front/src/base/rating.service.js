var $http, $q, $filter;

class RatingService {
    constructor($$http, $$q, $$filter) {
        $http = $$http;
        $q = $$q;
        $filter = $$filter;

        this.ratings = null;
    }

    add(artist, user_id, rating) {
        var self = this;

        return $q(function (resolve, reject) {
            $http
                .post('/rating/submit', { artist : artist, user: user_id, rating : rating})
                .success(function (data) {
                    self.ratings.push(data);
                    resolve(data);
                })
                .error(function (err) {
                    console.error(err);
                    reject(err)
                });
        });
    }

    get(user_id) {
        var self = this;

        return $q(function (resolve, reject) {
            $http
                .post('/rating/get', { user : user_id })
                .success(function (data) {
                    self.ratings = $filter('filter')(data, {ratingGiven: '!0'});

                    resolve(self.ratings);
                })
                .error(function (err) {
                    console.error(err);
                    reject(err)
                });
        });
    }

    remove(user_id, station) {
        var self = this;

        return $q(function (resolve, reject) {
            $http
                .post('/rating/delete', { user : user_id, artist : station.artist._id })
                .success(function (data) {
                    resolve(data);
                })
                .error(function (err) {
                    console.error(err);
                    reject(err)
                });
        });
    }

    check(tracks) {
        var self = this;

        return $q(function (resolve, reject) {
            self.ratings.forEach(function(el){
                for(var i = 0; i < tracks.length; i++) {
                    var trackArtistId = tracks[i].artists ? tracks[i].artists[0].id : tracks[i].artist.spotifyId;
                    if (el.artist.spotifyId == trackArtistId) {
                        tracks[i].ratingGiven = el.ratingGiven;
                    }
                }
            });
            resolve(tracks);
        });
    }
}

RatingService.$inject = ['$http', '$q', '$filter'];

angular
    .module('streamfeed.base')
    .service('RatingService', RatingService);