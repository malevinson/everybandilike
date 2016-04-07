angular
    .module('ebil.share')
    .controller('ShareController', ShareController);

ShareController.$inject = ['$rootScope', '$auth', '$uibModal', 'RatingService', 'SpotifyService', 'Storage', 'toastr', '$stateParams', '$aside'];

function ShareController($rootScope, $auth, $uibModal, RatingService, SpotifyService, Storage, toastr, $stateParams, $aside) {
    var self = this;
    self.$auth = $auth;
    self.user = $auth.provider.user;
    self.loaded = false;

    self.artists = {
        one : [],
        two : [],
        three : []
    };

    self.popover = {
        template: '/share/partials/popover.html',
        show: ((self.user && self.user.tour) ? false : true)
    };

    self.finishTour = () => {
        self.popover.show = false;
        if (self.$auth.provider.isAuthenticated()) {
            self.$auth.provider.update({tour: true});
        }
    };


    // Artists

    if ($auth.provider.isAuthenticated() && $stateParams.id) {
        if ($stateParams.id == self.user._id) {
            self.user_role = 'owner';
        } else {
            self.user_role = 'viewer';
        }

        // if user is authenticated and we have id in url
        RatingService
            .get($stateParams.id)
            .then(function (result) {
                result.forEach(function (el) {
                    self.artists[arrayName(el.ratingGiven)].push(el);
                });
                self.loaded = true;
            });

    } else if ($auth.provider.isAuthenticated() && !$stateParams.id) {
        self.user_role = 'owner';
        // if user authenticated we resolving data from db
        RatingService
            .get(self.user._id)
            .then(function (result) {
                if (result.length == 0) {
                    //
                }
                result.forEach(function (el) {
                    self.artists[arrayName(el.ratingGiven)].push(el);
                });
                self.loaded = true;
            });

    } else if (!$auth.provider.isAuthenticated() && $stateParams.id) {
        self.user_role = 'viewer';
        // if user not authenticated and we have id in url we getting data from db for user that is in url
        RatingService
            .get($stateParams.id)
            .then(function (result) {
                result.forEach(function (el) {
                    self.artists[arrayName(el.ratingGiven)].push(el);
                });
                self.loaded = true;
            });

    } else if (!$auth.provider.isAuthenticated() && !$stateParams.id) {
        self.user_role = 'owner';

        // if user not authenticated and we DON'T have id in url we getting data from localstorage
        var result = Storage.get('artists');
        if (result == null) {
            //
        } else {
            result.forEach(function (el) {
                self.artists[arrayName(el.ratingGiven)].push(el);
            });
        }
        self.loaded = true;
    }

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

    // Saving artist to db if user authenticated
    $rootScope.$on('rating:add', function(e, artist, user_id){
        RatingService
            .add(artist.artist, user_id, artist.ratingGiven)
            .then(function(result){
                angular.forEach(self.artists, function(value, key) {
                    value.forEach(function(el, i){
                        if (el.artist.spotifyId == result.artist.spotifyId) {
                            self.artists[key].splice(i, 1);
                        }
                    });
                });
                self.artists[arrayName(artist.ratingGiven)].push(result);
            })
    });

    // Saving artist to localstorage if user not authenticated
    $rootScope.$on('artists:add', function(e, artist){
        var artists = Storage.get('artists');

        if (!artists) artists = [];

        artists.forEach(function(el, i){
            if (el.artist.spotifyId == artist.artist.spotifyId) {
                artists.splice(i, 1);
            }
        });
        artists.push(artist);

        Storage.set('artists', artists);

        angular.forEach(self.artists, function(value, key) {
            value.forEach(function(el, i){
                if (el.artist.spotifyId == artist.artist.spotifyId) {
                    self.artists[key].splice(i, 1);
                }
            });
        });
        self.artists[arrayName(artist.ratingGiven)].push(artist);
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
            animation: true,
            templateUrl: `share/partials/aside.controller.html`,
            placement: position,
            backdrop: true,
            controller: 'AsideController',
            controllerAs: 'vm',
            resolve: {
                user_role: function () {
                    return self.user_role;
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
                $rootScope.$state.go('share', { id : '' }, { reload: true });
                toastr.warning('Logged out!', 'Success');

            })
            .catch(function(err) {
                console.error(err);
                toastr.error(err, 'Error');
            });
    };
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