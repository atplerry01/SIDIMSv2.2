(function () {
    'use strict';
    var controllerId = 'JobServiceUpdateCO';
    angular
        .module('app')
        .controller('JobServiceUpdateCO', JobServiceUpdateCO);

    JobServiceUpdateCO.$inject = ['$location', '$routeParams', '$scope', 'config', 'common', 'datacontext', 'model', 'resourceService'];

    function JobServiceUpdateCO($location, $routeParams, $scope, config, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;

        vm.goBack = goBack;
        vm.save = saveJob;
        vm.jobsetup = {};

        vm.errorMessage = '';

        activate();

        function activate() {
            initLookups();
            var promises = [getRequestedJob()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Variants View'); });
        }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            vm.serviceTypes = lookups.serviceTypes;
        }

        
        function getRequestedJob() {
            var val = $routeParams.id;

            if (val) {
                return datacontext.resourcejob.getJobByTrackerId(val)
                .then(function (data) {
                    vm.jobsetup = data[0];
                    //console.log(vm.jobsetup);
                    return vm.jobsetup;
                }, function (error) {
                    logError('Unable to get variant ' + val);
                });
            }
        }


        function goBack() { $window.history.back(); }

        function saveJob() {
            var val = $routeParams.id;

            if (document.getElementById('jobName').value === ""
                 || document.getElementById('jobName').value === undefined) {
                alert("Please select a valid Job Name");
                return false;
            }

            if (vm.jobsetup.jobName !== null || vm.jobsetup.jobName !== undefined) {

                vm.newJob = {
                    jobId: vm.jobsetup.id,
                    jobTrackerId: $routeParams.id,
                    serviceTypeId: vm.jobsetup.serviceType.id
                };

                //console.log(vm.newJob);
                updateEntity(vm.newJob);
            } else {
                //console.log('error');
                vm.errorMessage = 'No Service Selected';
            }

        }

        function updateEntity(entity) {
            var resourceUri = model.resourceUri.co + '/servicetype/update';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                //console.log(response);
                //vm.serverJob = {};
                //vm.jobsetup = {};
                gotoJobStatus();
            });
        }

        function gotoJobStatus() {
            $location.path('/job-status');
        }

    }
})();
