(function () {
    'use strict';
    var controllerId = 'PrintWasteRequestQA';
    angular
        .module('app')
        .controller('PrintWasteRequestQA', PrintWasteRequestQA);

    PrintWasteRequestQA.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function PrintWasteRequestQA($location, $routeParams, $scope, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.confirmWaste = confirmWaste;
        vm.wasteErrorSources = [];
        vm.departments = [];
        vm.updateErrorCode = updateErrorCode;

        activate();

        function activate() {
            initLookups();

            var promises = [getQAWasteRequests(), getJobs(), getJobTrackers()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            vm.wasteErrorSources = lookups.wasteErrorSources;
            vm.wasteErrorSourceCodes = lookups.wasteErrorSourceCodes;
            vm.departments = lookups.departments;
            //console.log(lookups);
            //console.log(vm.wasteErrorSources);
        }

        function getQAWasteRequests(forceRefresh) {
            return datacontext.resourcejob.getPrintQAWasteRequests(forceRefresh).then(function (data) {
                vm.wasterequests = data;
                //console.log(vm.wasterequests);
                return vm.wasterequests;
            });
        }

        function getJobs(forceRefresh) {
            return datacontext.resourcejob.getIncompleteJobs(forceRefresh).then(function (data) {
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



        function confirmWaste(entity) {

            // JobBadCardApproval
            var newEntity = {
                jobTrackerId: entity.jobTrackerId,
                jobSplitId: entity.jobSplitId,
                JobSplitCEAnalysisId: entity.id,
                WasteErrorSourceId: entity.waste.source.id,
                WasteByUnitId: entity.waste.department.id,
                QuantityBad: entity.quantityBad,
                QuantityHeld: entity.quantityHeld
            };

            ////console.log(newEntity);
            createEntity(newEntity);
        }

        function createEntity(entity) {
            var resourceUri = model.resourceUri.qac + '/printwasteapproval/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                //console.log(response);
                getQAWasteRequests();
            },
			 function (response) {
			     //console.log(response);
			     $scope.message = "Failed to save resource due to:" + response;
			 });
        }

        function goBack() { $window.history.back(); }


        function updateErrorCode(entity) {
            //console.log(vm.wasteErrorSourceCodes);

            vm.newWasteInfo = [];
            var uid = entity.id;
            //var uid = vm.job.sector.id;
            angular.forEach(vm.wasteErrorSourceCodes, function (todo, key) {
                if (todo.wasteErrorSourceId == uid) {
                    vm.newWasteInfo.push(todo);
                }
            });

            //console.log(vm.newWasteInfo);
        }
    
    }
})();
