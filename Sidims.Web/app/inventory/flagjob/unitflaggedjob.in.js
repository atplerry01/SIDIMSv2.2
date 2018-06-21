(function () {
    'use strict';
    var controllerId = 'UnitFlaggedJobIN';
    angular
        .module('app')
        .controller('UnitFlaggedJobIN', UnitFlaggedJobIN);

    UnitFlaggedJobIN.$inject = ['$location', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function UnitFlaggedJobIN($location, $scope, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.unFlaggedJob = unFlaggedJob;

        activate();

        function activate() {
            var promises = [getFlaggedJobs(), getJobs(), getJobTrackers()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getFlaggedJobs(forceRefresh) {
            var unit = "Inventory";
            return datacontext.resourcejob.getUnitFlaggedJobs(unit, forceRefresh).then(function (data) {
                vm.incomingPrints = data;
                return vm.incomingPrints;
            });
        }

        function unFlaggedJob(entity) {
            //console.log(entity);

            var newFlag = {
                id: entity.id,
                jobTrackerId: entity.jobTrackerId,
                flagTypeId: entity.flagTypeId,
                description: entity.description,
                recommendation: entity.recommendation
            };

            //console.log(newFlag);
            createEntity(newFlag);
        }

        function createEntity(entity) {
            var resourceUri = model.resourceUri.supervisor + '/unflagjob/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                getFlaggedJobs();
            },
			 function (response) {
			     //console.log(response);
			     $scope.message = "Failed to save due to: "
                     + response.data.message;
			 });
        }


        function getJobs(forceRefresh) {
            return datacontext.inventjob.getJobs(forceRefresh).then(function (data) {
                vm.jobs = data;
                return vm.jobs;
            });
        }

        function getJobTrackers(forceRefresh) {
            return datacontext.resourcejob.getJobTrackers(forceRefresh)
                .then(function (data) {
                    vm.jobTrackers = data;
                    return vm.jobTrackers;
                });
        }

        function gotoJobDetails(entity) {

            if (entity && entity.id) {
                $location.path('/pr/print-job/' + entity.id)
            }
        }

        function goBack() { $window.history.back(); }


    }
})();
