angular
    .module('ebil.share')
    .controller('ModalShareController', ModalShareController);

ModalShareController.$inject = ['$uibModalInstance', '$auth', 'toastr', 'share_link'];
function ModalShareController($uibInstance, $auth, toastr, share_link) {
    var self = this;

    self.user = $auth.provider.user;
    self.share_link = share_link;

    self.successCopied = () => {
        toastr.success('Link copied!', 'Success');
    };

    this.close = () => { $uibInstance.close() }
}