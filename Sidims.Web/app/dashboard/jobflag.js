(function () {
    'use strict';
    var controllerId = 'JobFlag';
    angular
        .module('app')
        .controller('JobFlag', JobFlag);

    JobFlag.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function JobFlag($location, $routeParams, $scope, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var val = $routeParams.trackerId;

        vm.jobTracker = undefined
        vm.flagTypes = [];
        vm.flag = {};
        vm.save = save;
        
        activate();

        function activate() {
            initLookups();

            var promises = [getRequestedJobTrackers()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Job Status View'); });
        }

        // Todo
        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            vm.flagTypes = lookups.flagTypes;
            vm.departments = lookups.departments;
        }

        function getRequestedJobTrackers(forceRefresh) {
            var val = $routeParams.trackerId;
            return datacontext.resourcejob.getJobTrackerById(val, forceRefresh).then(function (data) {
                vm.jobTracker = data;
                //console.log(vm.jobTracker);
                return vm.jobTracker;
            });
        }

        function save() {
            //console.log(vm.flag.department);
            var newFlag = {
                jobTrackerId: $routeParams.trackerId,
                targetUnitId: vm.flag.department.id,
                flagTypeId: vm.flag.flagType.id,
                description: vm.flag.description,
                recommendation: vm.flag.recommendation
            };

            //console.log(newFlag);
            createEntity(newFlag);
        }

        function createEntity(entity) {
            var resourceUri = model.resourceUri.common + '/flagjob/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                vm.flagjob = {};
                getJobTrackers();
                $location.path('/job/audit-trail/' + $routeParams.trackerId);
            },
			 function (response) {
			     //console.log(response);
			     $scope.message = "Failed to save due to: "
                     + response.data.message;
			 });
        }

        function getJobTrackers(forceRefresh) {
            return datacontext.resourcejob.getJobTrackers(forceRefresh)
                .then(function (data) {
                    vm.jobTrackers = data;
                    return vm.jobTrackers;
                });
        }

        function goBack() { $window.history.back(); }

    }
})();
