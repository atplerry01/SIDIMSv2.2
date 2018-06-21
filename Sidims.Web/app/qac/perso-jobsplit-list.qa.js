(function () {
    'use strict';
    var controllerId = 'PersoJobSplitListQA';
    angular
        .module('app')
        .controller('PersoJobSplitListQA', PersoJobSplitListQA);

    PersoJobSplitListQA.$inject = ['$location', '$routeParams', 'common', 'datacontext'];

    function PersoJobSplitListQA($location, $routeParams, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.gotoJobDetails = gotoJobDetails;
        vm.jobSplits = [];
        vm.qaIncomingPersos = [];

        activate();

        function activate() {
            var promises = [getJobSplits(), getJobTrackers(), getJobs()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        // get JobSplit
        function getJobSplits() {
            var val = $routeParams.trackerId;

            return datacontext.resourcejob.getPersoJobSplitByJobTrackerId(val)
                .then(function (data) {
                    vm.jobSplits = data;
                    //console.log(vm.jobSplits);
                }, function (error) {
                    logError('Unable to get JobSplit ' + entityId);
                });
        }

        function getJobTrackers(forceRefresh) {
            return datacontext.resourcejob.getJobTrackers(forceRefresh).then(function (data) {
                vm.jobTrackers = data;
                return vm.jobTrackers;
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
                $location.path('/qa/job-check/' + entity.id);
            }
        }

        function goBack() { $window.history.back(); }

    
    }
})();
