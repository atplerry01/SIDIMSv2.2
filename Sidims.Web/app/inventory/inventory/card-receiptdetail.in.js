(function () {
    'use strict';
    var controllerId = 'InventCardReceiptDetailIN';
    angular
        .module('app')
        .controller('InventCardReceiptDetailIN', InventCardReceiptDetailIN);

    InventCardReceiptDetailIN.$inject = ['$location', '$routeParams', 'common', 'datacontext'];

    function InventCardReceiptDetailIN($location, $routeParams, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.cardreceipts = [];

        activate();

        function activate() {
            
            var promises = [getRequestedReceipt()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated cardreceipt View'); });
        }

        function getRequestedReceipt() {
            var val = $routeParams.id;

            if (val !== undefined && val !== 'new' && !Number.isInteger(val)) {
                return datacontext.inventory.getCardReceiptById(val)
                     .then(function (data) {
                         vm.cardreceipt = data;
                     }, function (error) {
                         logError('Unable to get cardreceipt ' + val);
                     });
            }

        }


        function goBack() { $window.history.back(); }

    
    }
})();
