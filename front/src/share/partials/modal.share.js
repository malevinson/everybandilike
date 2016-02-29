angular
    .module('streamfeed.share')
    .controller('ModalShareController', ModalShareController);

ModalShareController.$inject = ['$uibModalInstance'];
function ModalShareController($uibInstance) {
    var self = this;

    self.modalMode = "upgrade";

    this.close = () => {
        $uibInstance.close();
    }

}