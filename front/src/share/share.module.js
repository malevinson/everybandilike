angular
    .module('ebil.share', [
        'ebil.base'
    ])
    .config(configure);

configure.$inject = ['$stateProvider'];
function configure($stateProvider) {
    $stateProvider
        .state('share', {
            url: '/:hash',
            controller: 'ShareController',
            controllerAs: 'share',
            templateUrl: 'share/share.controller.html',
            resolve : {
                user: [ '$stateParams', '$auth', function($stateParams, $auth) {
                    if ($stateParams.hash) {
                        $auth.provider
                            .getByHash($stateParams.hash)
                            .then(function(user){
                                return user;
                            });
                    }
                }]
            }
        })
}