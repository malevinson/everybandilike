angular
    .module('ebil.share')
    .controller('ModalUpgradeController', ModalUpgradeController);

ModalUpgradeController.$inject = ['$uibModalInstance'];
function ModalUpgradeController($uibInstance) {
    var self = this;

    self.modalMode = "upgrade";

    this.close = () => { $uibInstance.close(); }
}