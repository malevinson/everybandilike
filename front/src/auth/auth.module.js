angular
    .module('ebil.auth', [
        'ebil.base',

        'satellizer'
    ])
    .config(configure)
    .run(run);

configure.$inject = ['$stateProvider', '$authProvider'];
function configure($stateProvider, $authProvider) {
    $stateProvider
        .state('login', {
            url: '/login',
            controller : 'LoginController',
            controllerAs : 'self',
            templateUrl : 'auth/auth.controller.html'
        });

    $authProvider.facebook({
        clientId: CONFIG.facebook_id
    });
}

run.$inject = ['$rootScope', '$auth', 'Authentication'];
function run($rootScope, $auth, Authentication) {
    $auth.provider.initialize();
    $rootScope.user = $auth.provider.user;
}