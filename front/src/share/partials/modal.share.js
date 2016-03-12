angular
    .module('ebil.share')
    .controller('ModalShareController', ModalShareController);

ModalShareController.$inject = ['$uibModalInstance', '$location', '$auth', 'toastr'];
function ModalShareController($uibInstance, $location, $auth, toastr) {
    var self = this;
    self.user = $auth.provider.user;

    self.url = $location.$$absUrl + self.user._id;

    self.successCopied = () => {
        toastr.success('Link copied!', 'Success');
    };

    this.close = () => { $uibInstance.close() }
}