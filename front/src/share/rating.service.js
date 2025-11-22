var $http, $q, Authentication;

class RatingService {
    constructor($$http, $$q, $Authentication) {
        $http = $$http;
        $q = $$q;
        Authentication = $Authentication;
    }

    add(artist, user_id, rating) {
        return $http
            .post('/rating/submit', { artist : artist, user: user_id, rating : rating})
            .then(function (response) {
                return response.data;
            })
            .catch(function (err) {
                console.error(err);
                return $q.reject(err);
            });
    }

    get(hash) {
        return $http
            .get(`/rating/${hash}`)
            .then(function (response) {
                return response.data;
            })
            .catch(function (err) {
                console.error(err);
                return $q.reject(err);
            });
    }

    remove(user_id, station) {
        return $http
            .post('/rating/delete', { user : user_id, artist : station.artist._id })
            .then(function (response) {
                return response.data;
            })
            .catch(function (err) {
                console.error(err);
                return $q.reject(err);
            });
    }
    
    getLatestCollections() {
        return $http
            .get('/collections/latest')
            .then(function (response) {
                return response.data;
            })
            .catch(function (err) {
                console.error(err);
                return $q.reject(err);
            });
    }
}

RatingService.$inject = ['$http', '$q', 'Authentication'];

angular
    .module('ebil.share')
    .service('RatingService', RatingService);