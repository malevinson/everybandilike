angular
    .module('ebil.share')
    .controller('AsideController', AsideController);

AsideController.$inject = ['$rootScope', '$uibModalInstance', '$auth', '$uibModal', 'toastr', 'user_role', 'recent', 'share_link'];

function AsideController($rootScope, $uibModalInstance, $auth, $uibModal, toastr, user_role, recent, share_link) {
    var vm = this;
    vm.Authentication = $auth;
    vm.user = $auth.provider.user;
    vm.user_role = user_role;
    vm.recent_collections = recent;
    vm.share_link = share_link;

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

    vm.logout = () => {
        $auth.provider.logout()
            .then(function() {
                $uibModalInstance.dismiss();

                $rootScope.$state.go('share', { hash : '' }, { reload: true });
                toastr.warning('Logged out!', 'Success');
            })
            .catch(function(err) {
                $uibModalInstance.dismiss();
                console.error(err);
                toastr.error(err, 'Error');
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