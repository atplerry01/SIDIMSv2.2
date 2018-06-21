(function () {
    'use strict';
    var controllerId = 'WasteRequestQA';
    angular
        .module('app')
        .controller('WasteRequestQA', WasteRequestQA);

    WasteRequestQA.$inject = ['$location', '$routeParams', 'common', 'datacontext', 'model', 'resourceService'];

    function WasteRequestQA($location, $routeParams, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.confirmWaste = confirmWaste;
    
        activate();

        function activate() {
            var promises = [getQAWasteRequests()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getQAWasteRequests(forceRefresh) {
            return datacontext.resourcejob.getQAWasteRequests(forceRefresh).then(function (data) {
                vm.wasterequests = data;
                //console.log(vm.wasterequests);
                return vm.wasterequests;
            });
        }

        function confirmWaste(entity) {
            //console.log(entity);
            var newEntity = {
                id: entity.id,
                jobSplitId: entity.jobSplitId
            };

            createEntity(newEntity);
        }

        function createEntity(entity) {
            var resourceUri = model.resourceUri.qac + '/waste-request/update';
            resourceService.updateResource(resourceUri, entity).then(function (response) {
                //console.log(response);
                //getSplitAnalysis();
                //$location.path('/in/card-issuance/' + val);
            },
			 function (response) {
			     $scope.message = "Failed to save resource due to:" + response;
			 });
        }


        function goBack() { $window.history.back(); }

    
    }
})();
