angular
    .module('ebil.share')
    .directive('resize', resize);

resize.$inject = ['$timeout'];
function resize($timeout) {
    return function (scope, element) {
        var resizing = function() {
            var height = $('body').height();

            var offset = $('.navbar').height() + $('footer').height();
            element
                .css('height', (height - offset + 'px'));
        };

        $timeout(function(){
            resizing();
        }, 0);

        angular.element(window).bind('resize', function () {
            resizing();
        });
    }
}