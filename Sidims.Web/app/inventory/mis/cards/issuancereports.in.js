(function () {
    'use strict';
    var controllerId = 'MISIssuanceReportsIN';
    angular
        .module('app')
        .controller('MISIssuanceReportsIN', MISIssuanceReportsIN);

    MISIssuanceReportsIN.$inject = ['$location', '$routeParams', 'common', 'config', 'datacontext'];

    function MISIssuanceReportsIN($location, $routeParams, common, config, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;

        vm.issuancereports = [];

        activate();

        function activate() {
            
            var promises = [getIssuanceReports(), getJobs()];
            common.activateController(promises, controllerId)
                .then(function () {
                    log('Activated Jobs View');
                });
        }

        function getIssuanceReports(forceRefresh) {
            return datacontext.inventory.getAllIssuanceReports(forceRefresh).then(function (data) {
                vm.issuancereports = data;
                //console.log(vm.issuancereports);
                return vm.issuancereports;
            });
        }
  
        function getJobs(forceRefresh) {
            return datacontext.inventjob.getJobs(forceRefresh).then(function (data) {
                vm.jobs = data;
                return vm.jobs;
            });
        }

    }
})();
