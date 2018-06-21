(function () {
    'use strict';
    var controllerId = 'MISReportDetailIN';
    angular
        .module('app')
        .controller('MISReportDetailIN', MISReportDetailIN);

    MISReportDetailIN.$inject = ['$location', '$routeParams', 'common', 'config', 'datacontext'];

    function MISReportDetailIN($location, $routeParams, common, config, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;

        vm.stocklogs = [];

        activate();

        function activate() {
            var promises = [getClientStockLogs(), getClientReturnLogs(), getCardIssuances(), getJobs()];
            common.activateController(promises, controllerId)
                .then(function () {
                    log('Activated Jobs View');
                });
        }

        function getClientStockLogs(forceRefresh) {
            var val = $routeParams.productId;
            return datacontext.inventory.getClientStockLogs(val, forceRefresh).then(function (data) {
                vm.stocklogs = data;
                //console.log(vm.stocklogs);
                return vm.stocklogs;
            });
        }
     
        function getClientReturnLogs(forceRefresh) {
            var val = $routeParams.productId;
            return datacontext.inventory.getClientReturnLogs(val, forceRefresh).then(function (data) {
                vm.returnlogs = data;
                //console.log(vm.returnlogs);
                return vm.returnlogs;
            });
        }

        function getCardIssuances(forceRefresh) { //Todo: break it down to productid level
            return datacontext.inventory.getAllCardIssuances(forceRefresh).then(function (data) {
                vm.CardIssuances = data;
                return vm.CardIssuances;
            });
        }

        function getJobs(forceRefresh) {
            return datacontext.resourcejob.getJobs(forceRefresh).then(function (data) {
                vm.jobs = data;
                return vm.jobs;
            });
        }


        
    }
})();
