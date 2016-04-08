angular
    .module('ebil.base')
    .factory('$aside', aside);

aside.$inject = ['$uibModal'];

function aside($uibModal) {
    var defaults = this.defaults = {
        placement: 'left'
    };

    var asideFactory = {
        open: function(config) {
            var options = angular.extend({}, defaults, config);
            if(['left', 'right', 'bottom', 'top'].indexOf(options.placement) === -1) {
                options.placement = defaults.placement;
            }
            var vertHoriz = ['left', 'right'].indexOf(options.placement) === -1 ? 'vertical' : 'horizontal';
            options.windowClass  = 'ng-aside ' + vertHoriz + ' ' + options.placement + (options.windowClass ? ' ' + options.windowClass : '');
            delete options.placement;
            return $uibModal.open(options);
        }
    };
    return angular.extend({}, $uibModal, asideFactory);
}