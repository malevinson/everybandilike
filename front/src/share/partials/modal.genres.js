angular
    .module('ebil.base')
    .controller('ModalGenresController', ModalGenresController);

ModalGenresController.$inject = ['$rootScope', '$uibModalInstance', '$auth', '$q', 'SpotifyService'];

function ModalGenresController($rootScope, $uibInstance, $auth, $q, SpotifyService) {
    var self = this;

    this.Authentication = $auth;
    this.user = $auth.provider.user;

    self.modalMode = "choose";

    self.genres = {
        "Rock": ['alternative rock', 'blues-rock', 'classic rock', 'experimental rock', 'garage rock', 'indie rock', 'rap rock', 'southern rock'],
        'Pop': ['dance pop', 'alternative dance', 'indie pop', 'pop', 'pop punk', 'pop rock'],
        'Folk/Country': ['alternative country', 'country', 'folk', 'folk rock', 'folk-pop', 'indie folk'],
        'Hip-Hop/Rnb': ['alternative hip hop', 'dirty south rap', 'gangster rap',  'pop rap', 'hip hop', 'indie r&b', 'r&b', 'rap'],
        'Electronic': ['chill-out', 'chillwave', 'downtempo', 'edm', 'electronic', 'house', 'indietronica', 'trance'],
        '' : ['ska punk', 'reggae', 'jazz', 'classical']
    };

    self.selectedGenres = [];
    self.rankedGenres = [];

    self.toggleSelect = ($event, genre) => {
        var element = $($event.target);

        if (element.hasClass('selected')) {
            self.selectedGenres.splice(self.selectedGenres.indexOf(genre), 1);
            element.toggleClass('selected');
        } else if (self.selectedGenres.length < 3) {
            self.selectedGenres.push(genre);
            element.toggleClass('selected');
        }
    };

    self.rankGenres = () => {
        self.modalMode = "rank";
        self.loading = true;

        if (self.selectedGenres.length != 0) {

            self.modalMode = "rank";
            var defs = [];
            var list = [];

            self.selectedGenres.forEach(function (genre, index) {
                var promise = SpotifyService
                    .artistsByGenres(genre)
                    .then(function(artists){
                        list[index] = artists;
                    })
                    .catch(function(err){
                        console.error(err);
                        $q.reject(err);
                    });
                defs.push(promise);
            });

            $q.all(defs).then(function () {
                self.loading = false;

                list.forEach(function(el, index){
                    self.rankedGenres[index] = [];

                    el.forEach(function(item){
                        SpotifyService
                            .searchArtist(item.name)
                            .then(function (response) {
                                var artist = {
                                    artist: {
                                        name: response.name,
                                        spotifyId: response.id,
                                        picture: response.images.length ? response.images[0].url : '',
                                        genres: response.genres
                                    },
                                    ratingGiven: null
                                };

                                self.rankedGenres[index].push(artist);
                            });
                    });

                });
            });
        }
    };

    self.sendArtists = () => {
        self.loading = true;

        self.rankedGenres.forEach(function (artists, index) {
            var rate;
            switch (index) {
                case 0:
                    rate = 3;
                    break;
                case 1:
                    rate = 2;
                    break;
                case 2:
                    rate = 1;
                    break;
            }

            artists.forEach(function(artist){
                if (artist.selected) {
                    artist.ratingGiven = rate;

                    $auth.provider.isAuthenticated() ? $rootScope.$broadcast('rating:add', artist, self.user._id) : $rootScope.$broadcast('artists:add', artist);
                }
            });

            self.loading = false;
            self.close();
        });
    };

    self.rankConfig = {
        animation: 150,
        onEnd: function(e) {
            self.rankedGenres = e.models;
        }
    };

    self.cleanGenres = () => {
        self.modalMode = "choose";
        self.rankedGenres = [];
        self.selectedGenres = [];
    };

    self.close = () => { $uibInstance.close() }
}