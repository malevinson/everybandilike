angular
    .module('ebil.share')
    .controller('AsideController', AsideController);

AsideController.$inject = ['$uibModalInstance', '$auth', '$uibModal', '$location', 'user_role', 'RatingService'];

function AsideController($uibModalInstance, $auth, $uibModal, $location, user_role, RatingService) {
    var vm = this;
    vm.Authentication = $auth;
    vm.user = $auth.provider.user;
    vm.user_role = user_role;
    vm.recent_collections = [];

    initialize();

    function initialize() {
        var url = $location.$$host;

        if ($auth.provider.isAuthenticated()) {
            vm.share_link = `${url}/${vm.user.hash}`;
        }

        RatingService
            .getLatestCollections()
            .then(function(result){
                result.forEach(function(hash){

                    vm.recent_collections.push(`${url}/${hash}`);
                });
            });
    }

    vm.addGenres = () => {
        $uibModalInstance.dismiss();

        $uibModal.open({
            animation: true,
            templateUrl: '/share/partials/modal.genres.html',
            controller: 'ModalGenresController',
            controllerAs : 'modal',
            size: 'lg',
            keyboard: false,
            windowClass: 'onboarding'
        });
    };

    vm.login = () => {
        $uibModalInstance.dismiss();

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

    vm.share = () => {
        $uibModalInstance.dismiss();

        $uibModal.open({
            animation: true,
            templateUrl: '/share/partials/modal.share.html',
            controller: 'ModalShareController',
            controllerAs : 'modal',
            size: 'sm',
            keyboard: false,
            windowClass: 'share',
            resolve: {
                share_link: function () {
                    return vm.share_link;
                }
            }
        });
    };

    vm.cancel = function(e) {
        $uibModalInstance.dismiss();
        e.stopPropagation();
    }
}