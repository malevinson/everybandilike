angular
    .module('streamfeed.share', [
        'streamfeed.base'
    ])
    .config(configure);

configure.$inject = ['$stateProvider'];
function configure($stateProvider) {
    $stateProvider
        .state('share', {
            url: '/share/',
            views: {
                '': {
                    controller: 'ShareController',
                    controllerAs: 'share',
                    templateUrl: 'share/share.controller.html'
                }}
        })
}