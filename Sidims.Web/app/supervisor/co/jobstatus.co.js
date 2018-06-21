(function () {
    'use strict';
    var controllerId = 'JobStatusCO';
    angular
        .module('app')
        .controller('JobStatusCO', JobStatusCO);

    JobStatusCO.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function JobStatusCO($location, $routeParams, $scope, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.jobTrackers = [];
        vm.jobs = [];

        activate();

        function activate() {
           
            var promises = [getJobTrackers(), getJobs()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Job Status View'); });
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
                //console.log(vm.jobs);
                return vm.jobs;
            });
        }

        function gotoJobDetails(entity) {
            if (entity && entity.id) {
                $location.path('/co/job-setup/' + entity.id)
            }
        }

        function goBack() { $window.history.back(); }

        function saveJob() {
            var val = $routeParams.id;

            vm.newJob = {
                jobName: vm.jobName.jobName,
                sidSectorId: vm.job.sector.id,
                sidClientId: vm.job.client.id,
                remarkId: vm.job.remark.id,
                serviceTypeId: vm.job.serviceType.id,
                quantity: vm.job.quantity
            };

            createEntity(vm.newJob);
        }

        function gotoJobStatus() {
            $location.path('/co/job-status');
        }

    }
})();
