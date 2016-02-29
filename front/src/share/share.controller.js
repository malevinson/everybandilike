angular
    .module('streamfeed.share')
    .controller('ShareController', ShareController);

ShareController.$inject = ['$rootScope', '$auth', '$uibModal', 'RatingService', 'SpotifyService'];

function ShareController($rootScope, $auth, $uibModal, RatingService, SpotifyService) {
    var self = this;

    self.loaded = false;

    self.artists = {
        one : [],
        two : [],
        three : []
    };

        // if authenticated
        //RatingService
        //    .get(self.user._id)
        //    .then(function (result) {
        //        result.forEach(function (el) {
        //            self.artists[arrayName(el.ratingGiven)].push(el);
        //        });
        //        self.loaded = true;
        //    });

    self.add = (data, rating) => {
        self.loadingThree = true;

        if (data.length == 0) return;

        var artists = data.split(',');

        artists.forEach(function(artist){
            SpotifyService
                .searchArtist(artist)
                .then(function(data){
                    artist = {
                        genres: data.genres,
                        name: data.name,
                        picture: data.images[0].url,
                        spotifyId: data.id
                    };
                    return RatingService.add(artist, self.user._id, rating)
                })
                .then(function(result) {
                    angular.forEach(self.artists, function(value, key) {
                        value.forEach(function(el, i){
                            if (el.artist.spotifyId == result.artist.spotifyId) {
                                self.artists[key].splice(i, 1);
                            }
                        });
                    });

                    self.artists[arrayName(rating)].push(result);

                    self.loadingThree = false;
                })
                .catch(function(err){
                    console.error(err);
                    self.loadingThree = false;
                });
        });
    };

    self.remove = (artist, array) => {
        var index = self.artists[array].indexOf(artist);

        RatingService
            .remove(self.user._id, artist)
            .then(function(){
                self.artists[array].splice(index, 1);
            });
    };

    self.share = function() {
        $uibModal.open({
            animation: true,
            templateUrl: '/share/partials/modal.share.html',
            controller: 'ModalShareController',
            controllerAs : 'modal',
            size: 'sm',
            keyboard: false,
            windowClass: 'onboarding'
        });
    };

    $rootScope.openOnboarding = function() {
        $uibModal.open({
            animation: true,
            templateUrl: '/main/partials/modal.genres.html',
            controller: 'ModalGenresController',
            controllerAs : 'modal',
            size: 'lg',
            keyboard: false,
            windowClass: 'onboarding'
        });
    };

    this.logout = function () {
        self.Authentication.provider.logout()
            .then(function() {
                $rootScope.$broadcast('auth:logout');
                toastr.warning('Logged out!', 'Success');
            })
            .catch(function(err) {
                console.error(err);
                toastr.error(err, 'Error');
            });
    };

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