(function () {
    'use strict';
    var controllerId = 'InventCardReceiptLogIN';
    angular
        .module('app')
        .controller('InventCardReceiptLogIN', InventCardReceiptLogIN);

    InventCardReceiptLogIN.$inject = ['$location', '$routeParams', '$window', 'common', 'datacontext'];

    function InventCardReceiptLogIN($location, $routeParams, $window, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.addCardReceipt = addCardReceipt
        vm.goBack = goBack;
        vm.receiptlog = [];

        activate();

        function activate() {
            var promises = [getRequestedReceiptLog(), getRequestedSCMCardRequest()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated InventCardReceiptLog View'); });
        }

        function getRequestedReceiptLog() {
            var val = $routeParams.id;

            if (val !== undefined && val !== 'new' && !Number.isInteger(val)) {
                return datacontext.inventory.getReceiptLogByRequestId(val)
                     .then(function (data) {
                         vm.receiptlog = data;
                         //console.log(vm.receiptlog);
                     }, function (error) {
                         logError('Unable to get cardreceiptlog ' + val);
                     });
            }

        }

        function getRequestedSCMCardRequest() {
            var val = $routeParams.id;

            if (val !== undefined && val !== 'new') {
                return datacontext.inventory.getSCMCardRequestById(val)
                .then(function (data) {
                    vm.cardrequest = data;
                }, function (error) {
                    logError('Unable to get cardrequest ' + val);
                });
            }
        }
      
        function goBack() { $window.history.back(); }

        function addCardReceipt() {
            var val = $routeParams.id;
            $location.path('/in/inventory/card-request/' + val + '/receiptlog/new');
        }
    
        //Todo: Get ReceiverId

    }
})();
