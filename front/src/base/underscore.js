angular
    .module('streamfeed.base')
    .factory('underscore', underscore);

underscore.$inject = ['$window'];
function underscore($window) {
    return $window._;
}