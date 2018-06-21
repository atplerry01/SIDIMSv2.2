(function () {
    'use strict';
    var controllerId = 'FirstCardPrintCE';
    angular
        .module('app')
        .controller('FirstCardPrintCE', FirstCardPrintCE);

    FirstCardPrintCE.$inject = ['$location', 'common', 'datacontext'];

    function FirstCardPrintCE($location, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.jobBatchTracker = [];
        vm.jobTrackers = [];
        vm.issuanceLogs = [];
        vm.allIssuanceLogs = [];

        vm.gotoJobDetails = gotoJobDetails;
        activate();

        function activate() {
            var promises = [getRequestedBatchTracker(), getIncomingJobs(), getJobs()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getIncomingJobs(forceRefresh) {
            return datacontext.inventjob.getIncomingJobs(forceRefresh).then(function (data) {
                vm.incomingJobs = data;
                return vm.incomingJobs;
            });
        }

        function getJobs(forceRefresh) {
            return datacontext.inventjob.getJobs(forceRefresh).then(function (data) {
                vm.jobs = data;
                return vm.jobs;
            });
        }

        function gotoJobDetails(entity) {
            if (entity && entity.id) {
                $location.path('/ce/first-card/' + entity.job.id)
            }
        }

        function goBack() { $window.history.back(); }

        function getRequestedBatchTracker() {
            var val = $routeParams.batchId;
            return datacontext.resourcejob.getJobBatchTrackerById(val)
               .then(function (data) {
                   vm.jobBatchTracker = data;
                   getJobIssuanceLog(vm.jobBatchTracker.cardIssuanceLogId);
               }, function (error) {
                   logError('Unable to get JobBatchTracker ' + val);
               });
        }

        function getJobIssuanceLog(logId) {
            return datacontext.inventjob.getCardIssuanceLogById(logId)
                .then(function (data) {
                    vm.issuanceLogs = data;
                }, function (error) {
                    logError('Unable to get CardIssuanceLog ' + val);
                });
        }


    }
})();
