(function () {
    'use strict';
    var controllerId = 'WasteApprovedQA';
    angular
        .module('app')
        .controller('WasteApprovedQA', WasteApprovedQA);

    WasteApprovedQA.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function WasteApprovedQA($location, $routeParams, $scope, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.confirmWaste = confirmWaste;
        vm.wasteErrorSources = [];

        activate();

        function activate() {
            initLookups();

            var promises = [];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            vm.wasteErrorSources = lookups.wasteErrorSources;
            //console.log(lookups);
            //console.log(vm.wasteErrorSources);

        }

        function getApprovedWasteRequests(forceRefresh) {
            return datacontext.resourcejob.getIssuedWasteRequests(forceRefresh).then(function (data) {
                vm.wasterequests = data;
                //console.log(vm.wasterequests);
                return vm.wasterequests;
            });
        }

        function confirmWaste(entity) {
            //console.log(entity);

            // JobBadCardApproval
            var newEntity = {
                jobSplitId: entity.jobSplitId,
                JobSplitCEAnalysisId: entity.id,
                WasteErrorSourceId: entity.wastesource.id
            };

            createEntity(newEntity);
        }

        function createEntity(entity) {
            var resourceUri = model.resourceUri.qac + '/wasteapproval/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                //console.log(response);
                getQAWasteRequests();
                //getSplitAnalysis();
                //$location.path('/in/card-issuance/' + val);
            },
			 function (response) {
			     //console.log(response);
			     $scope.message = "Failed to save resource due to:" + response;
			 });
        }


        function goBack() { $window.history.back(); }

    
    }
})();
