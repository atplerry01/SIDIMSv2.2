(function () {
    'use strict';
    var controllerId = 'MISWasteReportsIN';
    angular
        .module('app')
        .controller('MISWasteReportsIN', MISWasteReportsIN);

    MISWasteReportsIN.$inject = ['$location', '$routeParams', 'common', 'config', 'datacontext'];

    function MISWasteReportsIN($location, $routeParams, common, config, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;

        vm.wastereports = [];

        activate();

        function activate() {
            
            var promises = [getWasteReports(), getJobs(), getJobTrackers()];
            common.activateController(promises, controllerId)
                .then(function () {
                    log('Activated Jobs View');
                });
        }

        function getWasteReports(forceRefresh) {
            return datacontext.inventory.getAllCardWasteReports(forceRefresh).then(function (data) {
                vm.wastereports = data;
                //console.log(vm.wastereports);
                return vm.wastereports;
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

        function getJobSplits(entityId) {
            return datacontext.resourcejob.getJobSplitByJobTrackerId(entityId)
                .then(function (data) {
                    vm.jobSplits = data;
                }, function (error) {
                    logError('Unable to get JobSplit ' + entityId);
                });
        }




    }
})();
