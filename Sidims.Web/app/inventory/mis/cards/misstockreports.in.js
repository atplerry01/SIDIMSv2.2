(function () {
    'use strict';
    var controllerId = 'MISStockReportsIN';
    angular
        .module('app')
        .controller('MISStockReportsIN', MISStockReportsIN);

    MISStockReportsIN.$inject = ['$location', '$routeParams', 'common', 'config', 'datacontext'];

    function MISStockReportsIN($location, $routeParams, common, config, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;

        vm.products = [];
        vm.stockrepots = [];
        vm.gotoStockReportLog = gotoStockReportLog;

        activate();

        function activate() {
            var promises = [getClientStockReports()];
            common.activateController(promises, controllerId)
                .then(function () {
                    log('Activated Jobs View');
                });
        }

        function getClientStockReports(forceRefresh) {
            var val = $routeParams.productId;
            return datacontext.inventory.getClientStockReports(val, forceRefresh).then(function (data) {
                vm.stockrepots = data;
                //console.log(vm.stockrepots);
                return vm.stockrepots;
            });
        }

        function gotoStockReportLog(entity) {
            getClientStockLogs(entity.id);
        }


        function getClientStockLogs(pred, forceRefresh) {
            return datacontext.inventory.getClientStockLogByStockReportId(pred, forceRefresh).then(function (data) {
                vm.stockreportlogs = data;
                getClientIssuanceByStockLog(pred);
                getJobByCardIssuanceId(pred);
                return vm.stockreportlogs;
            });
        }

        function getClientIssuanceByStockLog(pred, forceRefresh) {
            return datacontext.inventory.getCardIssuanceByStockLog(pred, forceRefresh).then(function (data) {
                vm.cardIssuance = data;
                return vm.cardIssuance;
            });
        }

        function getJobByCardIssuanceId(pred, forceRefresh) {
            return datacontext.inventory.getJobByCardIssuanceId(pred, forceRefresh).then(function (data) {
                vm.jobs = data;
                return vm.jobs;
            });
        }


    }
})();
