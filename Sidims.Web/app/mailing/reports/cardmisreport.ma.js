(function () {
    'use strict';
    var controllerId = 'CardMISReportMA';
    angular
        .module('app')
        .controller('CardMISReportMA', CardMISReportMA);

    CardMISReportMA.$inject = ['$location', '$routeParams', '$scope', 'common', 'config', 'datacontext', 'model', 'resourceService'];

    function CardMISReportMA($location, $routeParams, $scope, common, config, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;

        vm.misreports = [];
        vm.jobs = [];
  
        activate();

        function activate() {
            initLookups();

            var promises = [getCardMISReports(), getJobSplits(), getJobTrackers(), getJobs()];
            common.activateController(promises, controllerId)
                .then(function () {
                    log('Activated Job Status View');
                });
        }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
        }

        function getCardMISReports(forceRefresh) {
            return datacontext.mailingjob.getMAJobSplits(forceRefresh).then(function (data) {
                vm.misreports = data;
                //console.log(vm.misreports);
                return vm.misreports;
            });
        }

        function getJobSplits(entityId) {
            return datacontext.resourcejob.getCEJobSplits()
                .then(function (data) {
                    vm.jobSplits = data;
                }, function (error) {
                    logError('Unable to get JobSplit ' + entityId);
                });
        }

        function getJobTrackers(forceRefresh) {
            return datacontext.resourcejob.getJobTrackers(forceRefresh).then(function (data) {
                vm.jobTrackers = data;
                //console.log(vm.jobTrackers);
                return vm.jobTrackers;
            });
        }

        function getJobs(forceRefresh) {
            return datacontext.resourcejob.getJobs(forceRefresh).then(function (data) {
                vm.jobs = data;
                return vm.jobs;
            });
        }

        function goBack() { $window.history.back(); }

    }

})();
