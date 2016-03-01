angular
    .module('streamfeed.base', [
        'ui.router',
        'ui.bootstrap',
        'ui.slider',
        'ngAnimate',
        'ng-sortable',
        'toastr',
        'satellizer',
        'angular-loading-bar',
        'ngJoyRide'
    ])
    .config(configure)
    .run(run);

configure.$inject = ['$locationProvider', '$stateProvider', 'toastrConfig', '$urlRouterProvider'];
function configure($locationProvider, $stateProvider, toastrConfig, $urlRouterProvider) {
    $locationProvider.html5Mode({
        enabled : true,
        requireBase : true,
        rewriteLinks : true
    });

    $stateProvider
        .state('front', {
            url : '/',
            template: '',
            controller : [ "$state", function ($state){
                return $state.go('share')
            }]
        })
        .state('403', {
            url : '/403',
            template : '<h1>Unauthorised access</h1>'
        })
        .state('404', {
            url : '/404',
            template : '<h1>Page not found</h1>'
        })
        .state('500', {
            url : '/500',
            template : '<h1>Internal error</h1>'
        });

    $urlRouterProvider.otherwise('/');

    angular.extend(toastrConfig, {
        autoDismiss: false,
        containerId: 'toast-container',
        maxOpened: 0,
        newestOnTop: true,
        positionClass: 'toast-top-right',
        preventDuplicates: false,
        preventOpenDuplicates: false,
        target: 'main',
        tapToDismiss: true
    });

}

run.$inject = ['$state', '$rootScope', '$location'];
function run($state, $root, $location) {
    $root.$on('$stateChangeSuccess',
        function(){
            ga('send', 'pageview', $location.path());
        });

    $root.$state = $state;
}