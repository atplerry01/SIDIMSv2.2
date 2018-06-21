(function () {
    'use strict';
    var controllerId = 'DriverAssignmentAU';
    angular
        .module('app')
        .controller('DriverAssignmentAU', DriverAssignmentAU);

    DriverAssignmentAU.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function DriverAssignmentAU($location, $routeParams, $scope, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.entity = [];
        vm.save = save;

        activate();

        function activate() {
            
          
            var promises = [getDrivers()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated JobDetails View'); });
        }

        function getDrivers(forceRefresh) {
            return datacontext.materialaudit.getDrivers(forceRefresh).then(function (data) {
                vm.drivers = data;
                //console.log(vm.drivers);
                return vm.drivers;
            });
        }

        function goBack() { $window.history.back(); }

        function save() {
            var val = $routeParams.reportId;
         
            vm.newEntity = {
                deliveryNoteId: val,
                driverId: vm.entity.driver.id
            };

            createEntity(vm.newEntity);
        }

        function createEntity(entity) {
            var resourceUri = model.resourceUri.materialaudit + '/dispatch/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                $location.path('/au/incoming-jobs');
            },
			 function (response) {
			     //console.log(response);
			 });
        }

     

    }


})();
