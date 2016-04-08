var $http, $q, Authentication;

class RatingService {
    constructor($$http, $$q, $Authentication) {
        $http = $$http;
        $q = $$q;
        Authentication = $Authentication;
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

    get(hash) {
        return $q(function (resolve, reject) {
            $http
                .get(`/rating/${hash}`)
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
    
    getLatestCollections() {
        return $q(function (resolve, reject) {
            $http
                .get('/collections/latest')
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

RatingService.$inject = ['$http', '$q', 'Authentication'];

angular
    .module('ebil.share')
    .service('RatingService', RatingService);