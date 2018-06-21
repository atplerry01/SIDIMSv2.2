(function () {
    'use strict';
    var controllerId = 'InventCardReceiptIN';
    angular
        .module('app')
        .controller('InventCardReceiptIN', InventCardReceiptIN);

    InventCardReceiptIN.$inject = ['$location', '$routeParams', 'common', 'datacontext'];

    function InventCardReceiptIN($location, $routeParams, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.addCardReceipt = addCardReceipt
        vm.cardreceipts = [];

        activate();

        function activate() {
            
            var promises = [getCardReceipts()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getCardReceipts(forceRefresh) {
            return datacontext.inventory.getEmbedCardReceipts(forceRefresh).then(function (data) {
                vm.cardreceipts = data;
                //console.log(vm.cardreceipts);
                return vm.cardreceipts;
            });
        }

      
        function goBack() { $window.history.back(); }

        function addCardReceipt() {
            $location.path('in/inventory/card-receipt/new');
        }
    
    }
})();
