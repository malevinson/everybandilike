angular
    .module('ebil.base')
    .factory('ArtistsProvider', ArtistsProvider);

ArtistsProvider.$inject = ['$q', 'SpotifyService', 'YoutubeService', 'underscore'];

function ArtistsProvider($q, SpotifyService, YoutubeService, underscore) {
    var _ = underscore;

    function getTopTrackIds(tracks, artist) {
        var defs = [];

        tracks.forEach(function(track) {
            var promise = YoutubeService.getTrackId(artist.name, track.name)
                .then(function(id) {
                    if (id) {
                        return {
                            artist: artist,
                            songId: id,
                            name: track.name,
                            duration: track.duration_ms
                        }
                    }
                });

            defs.push(promise);
        });
        return $q.all(defs);
    }

    return {
        getRelatedArtists: function(artist_id) {
            return SpotifyService.relatedArtists(artist_id)
                .then(function(response) {
                    var defs = [];
                    response.forEach(function (artist) {
                        var data = {
                            artist: {
                                name: artist.name,
                                spotifyId: artist.id,
                                picture: artist.images.length > 0 ? artist.images[0].url : '',
                                genres : artist.genres

                            },
                            ratingGiven: null
                        };

                        defs.push(data);
                    });
                    return $q.all(defs)
                })
                .catch(function(err){
                    return $q.reject(err)
                })
        },

        getTopTracks: function(artist) {
            return SpotifyService.searchArtist(artist)
                .then(function(artist) {
                    return SpotifyService.topTracks(artist.id);
                })
                .then(function(tracks) {
                    return tracks;
                })
                .catch(function(err){
                    console.error(err);
                    return $q.reject(err)
                })
        },

        createPlaylist: function(artist, artistOnly, track) {
            var self = this;
            var playlist = [], firstTrack;

            if (track) firstTrack = track;

            if (artistOnly) {
                return self.getTopTracks(artist.artist.name)
                    .then(function(tracks){
                        return getTopTrackIds(tracks, artist.artist)
                    })
                    .then(function(tracks) {
                        tracks.forEach(function (el, i) {
                            if (!el) {
                                tracks.splice(i, 1);
                            }
                        });

                        playlist = _.shuffle(tracks);
                        if (track) playlist.unshift(firstTrack);

                        return playlist;
                    });

            } else {
                return self.getRelatedArtists(artist.artist.spotifyId)
                    .then(function (artists) {
                        var defs = [];
                        artists.unshift(artist);
                        artists.splice(10);

                        artists.forEach(function(artist, i) {
                            var promise = $q(function(resolve, reject) {
                                self.getTopTracks(artist.artist.name)
                                    .then(function(tracks){
                                        if (i != 0) { tracks.splice(4) }
                                        return getTopTrackIds(tracks, artist.artist)
                                    })
                                    .then(function(tracks) {
                                        tracks.forEach(function (el, i) {
                                            if (!el) { tracks.splice(i, 1); }
                                        });

                                        if (!track && artists.indexOf(artist) == 0) {
                                            firstTrack = tracks.splice(Math.ceil(Math.random()*7), 1)[0];
                                        }

                                        resolve(tracks);
                                    })
                                    .catch(function(err) {
                                        resolve([]);
                                    })
                            });
                            defs.push(promise);
                        });
                        return $q.all(defs);
                    })
                    .then(function(tracks){
                        playlist = [].concat.apply([], tracks);
                        playlist = _.shuffle(playlist);
                        playlist.unshift(firstTrack);
                        return playlist;
                    })
                    .catch(function(err){
                        return $q.reject(err)
                    })
            }
        }

    };
}