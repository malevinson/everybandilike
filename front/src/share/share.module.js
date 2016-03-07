angular
    .module('ebil.share', [
        'ebil.base'
    ])
    .config(configure);

configure.$inject = ['$stateProvider'];
function configure($stateProvider) {
    $stateProvider
        .state('share', {
            url: '/:id',
            controller: 'ShareController',
            controllerAs: 'share',
            templateUrl: 'share/share.controller.html',
            resolve : {
                user: [ '$stateParams', '$auth', function($stateParams, $auth) {
                    if ($stateParams.id) {
                        $auth.provider
                            .get($stateParams.id)
                            .then(function(user){
                                return user;
                            });
                    }
                }]
            }
        })
}