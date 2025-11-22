angular
    .module('ebil.share')
    .controller('ShareController', ShareController);

ShareController.$inject = ['$rootScope', '$auth', '$uibModal', 'RatingService', 'SpotifyService', 'Storage', 'toastr', '$stateParams', '$aside', '$location'];

function ShareController($rootScope, $auth, $uibModal, RatingService, SpotifyService, Storage, toastr, $stateParams, $aside, $location) {
    var self = this;
    var url = $location.$$host;

    self.$auth = $auth;
    self.user = $auth.provider.user;
    self.recent_collections = [];
    self.artists = {
        one : [],
        two : [],
        three : []
    };
    self.popover = {
        template: '/share/partials/popover.html',
        show: ((self.user && self.user.tour) ? false : true)
    };

    initialize();

    function initialize(){
        self.loaded = false;

        // Hardcoded mock artists
        var mockArtists = [
            {
                artist: {
                    name: 'The Beatles',
                    spotifyId: '3WrFJ7ztbogyGnTHbXXFlQ',
                    picture: 'https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132a15fbb0',
                    genres: ['rock', 'pop', 'british invasion']
                },
                ratingGiven: 3
            },
            {
                artist: {
                    name: 'Radiohead',
                    spotifyId: '4Z8W4fKeB5YxbusRsdQVPb',
                    picture: 'https://i.scdn.co/image/ab6761610000e5ebec0b0c0c0c0c0c0c0c0c0c0',
                    genres: ['alternative rock', 'art rock', 'electronic']
                },
                ratingGiven: 2
            }
        ];

        // Add mock artists to the appropriate rating arrays
        mockArtists.forEach(function (el) {
            self.artists[arrayName(el.ratingGiven)].push(el);
        });

        RatingService
            .getLatestCollections()
            .then(function(result){
                result.forEach(function(hash){
                    self.recent_collections.push(`${url}/${hash}`);
                });
            })
            .catch(function(err) {
                // Ignore errors, just use mock data
                console.log('Could not fetch latest collections, using mock data');
            });

        if ($auth.provider.isAuthenticated()) {
            console.log('in is auth')
            self.share_link = `${url}/${self.user.hash}`;

            RatingService
                .get($stateParams.hash || self.user.hash)
                .then(function (result) {
                    // Clear mock data if we get real data
                    if (result && result.length > 0) {
                        self.artists = { one: [], two: [], three: [] };
                    }
                    result.forEach(function (el) {
                        self.artists[arrayName(el.ratingGiven)].push(el);
                    });

                    self.loaded = true;
                })
                .catch(function(err) {
                    // If API fails, keep mock data
                    console.log('Could not fetch ratings, using mock data');
                    self.loaded = true;
                });

            ($stateParams.hash && ($stateParams.hash == self.user.hash)) ? self.user_role = 'owner' : self.user_role = 'viewer';
            !$stateParams.hash ? self.user_role = 'owner' : '';

        } else if (!$auth.provider.isAuthenticated() && $stateParams.hash) {
            self.user_role = 'viewer';

            RatingService
                .get($stateParams.hash)
                .then(function (result) {
                    // Clear mock data if we get real data
                    if (result && result.length > 0) {
                        self.artists = { one: [], two: [], three: [] };
                    }
                    result.forEach(function (el) {
                        self.artists[arrayName(el.ratingGiven)].push(el);
                    });
                    self.loaded = true;
                })
                .catch(function(err) {
                    // If API fails, keep mock data
                    console.log('Could not fetch ratings, using mock data');
                    self.loaded = true;
                });

        } else if (!$auth.provider.isAuthenticated() && !$stateParams.hash) {
            self.user_role = 'owner';

            var result = Storage.get('artists');
            if (result && result.length > 0) {
                // Clear mock data if we have stored data
                self.artists = { one: [], two: [], three: [] };
                result.forEach(function (el) {
                    self.artists[arrayName(el.ratingGiven)].push(el);
                });
            }

            self.loaded = true;
        }
    }

    self.finishTour = () => {
        self.popover.show = false;
        if (self.$auth.provider.isAuthenticated()) {
            self.$auth.provider.update({tour: true});
        }
    };

    self.add = (data, rating) => {
        if (data.length == 0) return;

        var artists = data.split(',');

        artists.forEach(function(artist){
            SpotifyService
                .searchArtist(artist)
                .then(function(data){
                    artist = {
                        artist : {
                            genres: data.genres,
                            name: data.name,
                            picture: data.images[0].url,
                            spotifyId: data.id
                        },
                        ratingGiven: rating
                    };

                    $auth.provider.isAuthenticated() ? $rootScope.$broadcast('rating:add', artist, self.user._id) : $rootScope.$broadcast('artists:add', artist);
                })
                .catch(function(err){
                    console.error(err);
                });
        });
    };

    $rootScope.$on('rating:add', function(e, artist, user_id){
        RatingService
            .add(artist.artist, user_id, artist.ratingGiven)
            .then(function(result){
                renderArtist(self.artists, result);
            })
    });

    $rootScope.$on('artists:add', function(e, artist){
        var artists = Storage.get('artists') || [];

        artists.forEach(function(el, i){
            if (el.artist.spotifyId == artist.artist.spotifyId) {
                artists.splice(i, 1);
            }
        });
        artists.push(artist);

        Storage.set('artists', artists);

        renderArtist(self.artists, artist);
    });

    self.remove = (artist, array, $index) => {
        if (!$auth.provider.isAuthenticated()) {
            var artists = Storage.get('artists');
            artists.forEach(function(el, i){
                if (el.artist.spotifyId == artist.artist.spotifyId) {
                    artists.splice(i, 1);
                }
            });
            Storage.set('artists', artists);

            self.artists[array].splice($index, 1);

        } else {
            RatingService
                .remove(self.user._id, artist)
                .then(function(){
                    self.artists[array].splice($index, 1);
                });
        }
    };


    // Navbar

    self.login = () => {
        $uibModal.open({
            animation: true,
            templateUrl: '/share/partials/modal.login.html',
            controller: 'ModalLoginController',
            controllerAs : 'modal',
            size: 'sm',
            keyboard: false,
            windowClass: 'login',
            resolve: {
                artists: ['Storage', function (Storage) {
                    return Storage.get('artists');
                }]
            }
        });
    };
    
    self.openAside = function(position) {
        self.asideState = {
            open: true,
            position: position
        };

        function postClose() {
            self.asideState.open = false;
        }

        $aside.open({
            templateUrl: `share/partials/aside.controller.html`,
            placement: position,
            backdrop: true,
            controller: 'AsideController',
            controllerAs: 'vm',
            resolve: {
                user_role: function () {
                    return self.user_role;
                },
                share_link: function () {
                    return self.share_link;
                },
                recent: function () {
                    return self.recent_collections;
                }
            }
        }).result.then(postClose, postClose);
    };

    self.upgrade = () => {
        $uibModal.open({
            animation: true,
            templateUrl: '/share/partials/modal.upgrade.html',
            controller: 'ModalUpgradeController',
            controllerAs : 'modal',
            size: 'sm',
            keyboard: false,
            windowClass: 'upgrade'
        });
    };

    self.logout = function () {
        $auth.provider.logout()
            .then(function() {
                $rootScope.$state.go('share', { hash : '' }, { reload: true });
                toastr.warning('Logged out!', 'Success');

            })
            .catch(function(err) {
                console.error(err);
                toastr.error(err, 'Error');
            });
    };


    // Common

    function renderArtist(artists, artist){
        angular.forEach(artists, function(value, key) {
            value.forEach(function(el, i){
                if (el.artist.spotifyId == artist.artist.spotifyId) {
                    artists[key].splice(i, 1);
                }
            });
        });

        artists[arrayName(artist.ratingGiven)].push(artist);
    }

    function arrayName(arrayIndex) {
        switch (arrayIndex) {
            case 1:
                return 'one';
                break;
            case 2:
                return 'two';
                break;
            case 3:
                return 'three';
                break;
        }
    }
}