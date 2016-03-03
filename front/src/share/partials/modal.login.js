angular
    .module('ebil.share')
    .controller('ModalLoginController', ModalLoginController);

ModalLoginController.$inject = ['$rootScope', 'artists', '$auth', '$uibModalInstance', 'toastr', 'Storage'];
function ModalLoginController($rootScope, artists, $auth, $uibInstance, toastr, Storage) {
    var self = this;

    self.Authentication = $auth;

    this.signUp = () => {
        $auth.signup(self.user)
            .then(function(result) {
                var user = result.data.user;
                self.Authentication.provider.setUser(user);
                toastr.success(`Welcome, ${user.first_name}`, 'Success');

                artists.forEach(function(artist){
                    $rootScope.$broadcast('rating:add', artist, user._id);
                });
                Storage.remove('artists');
                // while it will adding add spinner/animation?
                self.close();
            })
            .catch(function(error) {
                toastr.error(error.data.message);
            });
    };

    this.login = () => {
        $auth.login(self.user)
            .then(function(result) {
                var user = result.data.user;

                self.Authentication.provider.setUser(user);
                toastr.success(`Welcome, ${user.first_name}`, 'Success');

                self.close();
            })
            .catch(function(error) {
                toastr.error(error.data.message);
                self.close();
            });
    };

    this.close = () => {
        $uibInstance.close();
    }

}