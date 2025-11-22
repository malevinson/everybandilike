var $http, $q;

class SpotifyService {
    constructor($$http, $$q) {
        $http = $$http;
        $q = $$q;
    }

    artistsByGenres(genre) {
        return $http
            .get(`${CONFIG.api_url}/genre/topArtists/`,{
                params: {
                    genre: genre.toLowerCase(),
                    limit : 15
                }
            })
            .then(function (response) {
                return response.data;
            })
            .catch(function (err) {
                return $q.reject(err);
            });
    }

    getArtistById(spotifyId) {
        return $http
            .get(`${CONFIG.api_url}/thirdPartyApi/spotifyArtistById`, {
                params: {
                    param: spotifyId
                }
            })
            .then(function (response) {
                return response.data;
            })
            .catch(function (err) {
                return $q.reject(err);
            });
    }

    searchArtist(artist_name) {
        return $http
            .get(`https://api.spotify.com/v1/search`, {
                params: {
                    type : 'artist',
                    q: artist_name
                }
            })
            .then(function (response) {
                var data = response.data;
                if (data.error) { return $q.reject(`SPOTIFY_ERR [${data.error.status}]: ${data.error.message}`); }
                if (data.artists.items.length == 0) { return $q.reject(`SPOTIFY_ERR: Artist ${artist_name} Not Found`); }

                return data.artists.items[0];
            })
            .catch(function (err) {
                return $q.reject(err);
            });
    }

    relatedArtists(spotifyId) {
        return $http
            .get(`${CONFIG.api_url}/thirdPartyApi/spotifyRelatedArtists`, {
                params: {
                    param: spotifyId
                }
            })
            .then(function (response) {
                return response.data.artists;
            })
            .catch(function (err) {
                return $q.reject(err);
            });
    }

    topTracks(spotifyId) {
        return $http
            .get(`${CONFIG.api_url}/thirdPartyApi/spotifyTopTracks`, {
                params: {
                    param: spotifyId
                }
            })
            .then(function (response) {
                return response.data.tracks;
            })
            .catch(function (err) {
                return $q.reject(err);
            });
    }

    searchTrack(track) {
        return $http
            .get(`${CONFIG.api_url}/thirdPartyApi/spotifySearchTrack`, {
                params: {
                    param: track
                }
            })
            .then(function (response) {
                return response.data.tracks.items;
            })
            .catch(function (err) {
                return $q.reject(err);
            });
    }
}

SpotifyService.$inject = ['$http', '$q'];

angular
    .module('ebil.base')
    .service('SpotifyService', SpotifyService);