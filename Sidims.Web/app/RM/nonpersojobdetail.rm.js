(function () {
    'use strict';
    var controllerId = 'NonPersoDetailRM';
    angular
        .module('app')
        .controller('NonPersoDetailRM', NonPersoDetailRM);

    NonPersoDetailRM.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function NonPersoDetailRM($location, $routeParams, $scope, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.save = save;
        vm.product = undefined;

        $scope.message = '';

        activate();

        //Todo: Get List of Engineer

        function activate() {
            initLookups();

            var promises = [getRequestedNonPersoJob(), getProductDetail()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated JobDetails View'); });
        }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            vm.serviceTypes = lookups.serviceTypes;
            vm.remarks = lookups.remarks;
        }


        //get Product
    
        function getProductDetail() {
            var val = $routeParams.productId;
            return datacontext.inventory.getProductById(val)
              .then(function (data) {
                  vm.product = data;
              }, function (error) {
                  logError('Unable to get Product ' + val);
              });
        }
       

        function getRequestedNonPersoJob() {
            var val = $routeParams.id;

            if (val) {
                return datacontext.rm.getNonPersojobs(val)
                .then(function (data) {
                    vm.nonpersojob = data;
                    return vm.nonpersojob;
                }, function (error) {
                    logError('Unable to get nonpersojob ' + val);
                });
            }
        }

        function goBack() { $window.history.back(); }

        function save() {
            vm.newEntity = {
                sidProductId: $routeParams.productId,
                quantity: vm.entity.quantity,
                jobName: vm.entity.jobName,
                description: vm.entity.description,
                serviceTypeId: vm.entity.serviceType.id,
            };

            //console.log(vm.newEntity);
            createEntity(vm.newEntity);
        }

        function createEntity(entity) {
            var resourceUri = model.resourceUri.rm + '/nonpersojob/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                $location.path('/rm/nonperso-jobs');
            },
			 function (response) {
			     //console.log(response);
			     var errors = [];
			     for (var key in response.data.modelState) {
			         for (var i = 0; i < response.data.modelState[key].length; i++) {
			             errors.push(response.data.modelState[key][i]);
			         }
			     }
			     $scope.message = "Failed to save resource due to:" + errors.join(' ');
			 });
        }

    
    
    }
})();
