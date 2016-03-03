var $http, $q;

class SpotifyService {
    constructor($$http, $$q) {
        $http = $$http;
        $q = $$q;
    }

    artistsByGenres(genre) {
        return $q(function (resolve, reject) {
            $http
                .get(`${CONFIG.api_url}/genre/topArtists/`,{
                    params: {
                        genre: genre.toLowerCase(),
                        limit : 15
                    }
                })
                .success(function (data) {
                    console.log(data);
                    resolve(data);
                })
                .error(function (err) {
                    reject(err)
                });
        });
    }

    getArtistById(spotifyId) {
        return $q(function (resolve, reject) {
            $http
                .get(`${CONFIG.api_url}/thirdPartyApi/spotifyArtistById`, {
                    params: {
                        param: spotifyId
                    }
                })
                .success(function (data) {
                    resolve(data);
                })
                .error(function (err) {
                    reject(err)
                });
        });
    }

    searchArtist(artist_name) {
        return $q(function (resolve, reject) {
            $http
                .get(`${CONFIG.api_url}/thirdPartyApi/spotifySearchArtist`, {
                    params: {
                        param: artist_name
                    }
                })
                .success(function (data) {
                    if (data.error) { reject(`SPOTIFY_ERR [${data.error.status}]: ${data.error.message}`)}
                    if (data.artists.items.length == 0) { reject(`SPOTIFY_ERR: Artist ${artist_name} Not Found`) }

                    resolve(data.artists.items[0]);
                })
                .error(function (err) {
                    reject(err)
                });
        });
    }

    relatedArtists(spotifyId) {
        return $q(function (resolve, reject) {
            $http
                .get(`${CONFIG.api_url}/thirdPartyApi/spotifyRelatedArtists`, {
                    params: {
                        param: spotifyId
                    }
                })
                .success(function (data) {
                    resolve(data.artists);
                })
                .error(function (err) {
                    reject(err)

                });
        });
    }

    topTracks(spotifyId) {
        return $q(function (resolve, reject) {
            $http
                .get(`${CONFIG.api_url}/thirdPartyApi/spotifyTopTracks`, {
                    params: {
                        param: spotifyId
                    }
                })
                .success(function (data) {
                    resolve(data.tracks);
                })
                .error(function (err) {
                    reject(err)
                });
        });
    }

    searchTrack(track) {
        return $q(function (resolve, reject) {
            $http
                .get(`${CONFIG.api_url}/thirdPartyApi/spotifySearchTrack`, {
                    params: {
                        param: track
                    }
                })
                .success(function (data) {
                    resolve(data.tracks.items);
                })
                .error(function (err) {
                    reject(err)

                });
        });
    }
}

SpotifyService.$inject = ['$http', '$q'];

angular
    .module('ebil.base')
    .service('SpotifyService', SpotifyService);