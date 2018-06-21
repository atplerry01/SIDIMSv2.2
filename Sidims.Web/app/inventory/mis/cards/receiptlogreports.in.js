(function () {
    'use strict';
    var controllerId = 'MISReceiptLogReportsIN';
    angular
        .module('app')
        .controller('MISReceiptLogReportsIN', MISReceiptLogReportsIN);

    MISReceiptLogReportsIN.$inject = ['$location', '$routeParams', 'common', 'config', 'datacontext'];

    function MISReceiptLogReportsIN($location, $routeParams, common, config, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;

    
        activate();

        function activate() {
            
            var promises = [getReceiptLogReports()];
            common.activateController(promises, controllerId)
                .then(function () {
                    log('Activated Jobs View');
                });
        }

        function getReceiptLogReports(forceRefresh) {
            return datacontext.inventory.AllCardReceiptReports(forceRefresh).then(function (data) {
                vm.receiptrepots = data;
                //console.log(vm.receiptrepots);
                return vm.receiptrepots;
            });
        }

    }
})();
