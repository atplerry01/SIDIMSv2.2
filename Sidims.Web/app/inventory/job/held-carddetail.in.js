(function () {
    'use strict';
    var controllerId = 'HeldCardDetailIN';
    angular
        .module('app')
        .controller('HeldCardDetailIN', HeldCardDetailIN);

    HeldCardDetailIN.$inject = ['$location', '$routeParams', 'common', 'datacontext', 'model', 'resourceService'];

    function HeldCardDetailIN($location, $routeParams, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.cardanalysis = [];
        vm.confirmHeld = confirmHeld;

        activate();

        function activate() {
            var promises = [getSplitAnalysis(), getJobs()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getSplitAnalysis(forceRefresh) {
            var val = $routeParams.id;
            return datacontext.inventjob.getCESplitAnalysisHeldCard(val, forceRefresh).then(function (data) {
                vm.cardanalysis = data;
                //console.log(vm.cardanalysis);
                return vm.cardanalysis;
            });
        }

        function getJobs(forceRefresh) {
            return datacontext.inventjob.getJobs(forceRefresh).then(function (data) {
                vm.jobs = data;
                return vm.jobs;
            });
        }

        function confirmHeld(entity) {
            vm.newEntity = {
                id: entity.id,
                quantityHeld: entity.quantityHeld,
                jobSplitId: entity.jobSplitId
            };

            createEntity(vm.newEntity);
        }

        function createEntity(entity) {
            var resourceUri = model.resourceUri.inventory + '/heldcard-receipt/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                vm.cardsetup = {};
                //console.log(response);
                getSplitAnalysis();
                //$location.path('/in/card-issuance/' + val);
            },
			 function (response) {
			     $scope.message = "Failed to save resource due to:" + response;
			 });
        }











     

        function gotoJobDetails(entity) {
            if (entity && entity.id) {
                $location.path('/in/waste-job-log/' + entity.id)
            }
        }

        function goBack() { $window.history.back(); }

      
    

    }
})();
