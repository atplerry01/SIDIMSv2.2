(function () {
    'use strict';
    var controllerId = 'MISDispatchReportsIN';
    angular
        .module('app')
        .controller('MISDispatchReportsIN', MISDispatchReportsIN);

    MISDispatchReportsIN.$inject = ['$location', '$routeParams', 'common', 'config', 'datacontext'];

    function MISDispatchReportsIN($location, $routeParams, common, config, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;

        vm.dispatchreports = [];

        activate();

        function activate() {
            
            var promises = [getDispatchReports(), getJobTrackers(), getJobs()];
            common.activateController(promises, controllerId)
                .then(function () {
                    log('Activated Jobs View');
                });
        }

        function getDispatchReports(forceRefresh) {
            return datacontext.dispatchjob.getAllDispatchDelivery(forceRefresh).then(function (data) {
                vm.dispatchreports = data;
                //console.log(vm.dispatchreports);
                return vm.dispatchreports;
            });
        }


        function getJobs(forceRefresh) {
            return datacontext.inventjob.getJobs(forceRefresh).then(function (data) {
                vm.jobs = data;
                return vm.jobs;
            });
        }

        function getJobTrackers(forceRefresh) {
            return datacontext.resourcejob.getJobTrackers(forceRefresh).then(function (data) {
                vm.jobTrackers = data;
                return vm.jobTrackers;
            });
        }




        
    }
})();
