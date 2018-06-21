(function () {
    'use strict';
    var controllerId = 'JobDetailCO';
    angular
        .module('app')
        .controller('JobDetailCO', JobDetailCO);

    JobDetailCO.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext'];

    function JobDetailCO($location, $routeParams, $scope, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        //vm.gotoAddVariant = gotoAddVariant;
        vm.jobs = [];
        vm.jobTracker = undefined;
        vm.stateCheck = undefined;

        activate();

        function activate() {
            //initLookups();

            var promises = [getRequestedJobTracker()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated JobDetails View'); });
        }

        function getJobs(forceRefresh) {
            return datacontext.resourcejob.getJobs(forceRefresh).then(function (data) {
                vm.jobs = data;
                //console.log(vm.jobs);
                return vm.jobs;
            });
        }

        function getRequestedJobTracker() {
            var val = $routeParams.id;
            
            return datacontext.resourcejob.getJobTrackerByJobId(val)
                .then(function (data) {
                    vm.jobTracker = data;
                    //console.log(vm.jobTracker);
                }, function (error) {
                    logError('Unable to get JobTracker ' + val);
                });

        }

        function goBack() { $window.history.back(); }

    
    }
})();
