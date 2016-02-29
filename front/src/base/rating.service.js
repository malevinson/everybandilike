var $http, $q;

class RatingService {
    constructor($$http, $$q) {
        $http = $$http;
        $q = $$q;
    }

    add(artist, user_id, rating) {
        return $q(function (resolve, reject) {
            $http
                .post('/rating/submit', { artist : artist, user: user_id, rating : rating})
                .success(function (data) {
                    resolve(data);
                })
                .error(function (err) {
                    console.error(err);
                    reject(err)
                });
        });
    }

    get(user_id) {
        return $q(function (resolve, reject) {
            $http
                .post('/rating/get', { user : user_id })
                .success(function (data) {
                    resolve(data);
                })
                .error(function (err) {
                    console.error(err);
                    reject(err)
                });
        });
    }

    remove(user_id, station) {
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
}

RatingService.$inject = ['$http', '$q'];

angular
    .module('streamfeed.base')
    .service('RatingService', RatingService);