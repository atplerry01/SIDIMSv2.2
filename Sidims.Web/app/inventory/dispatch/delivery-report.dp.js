(function () {
    'use strict';
    var controllerId = 'DeliveryReportIN';
    angular
        .module('app')
        .controller('DeliveryReportIN', DeliveryReportIN);

    DeliveryReportIN.$inject = ['$location', '$window', 'common', 'datacontext'];

    function DeliveryReportIN($location, $window, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.gotoJobDetails = gotoJobDetails;
        vm.deliveryreports = [];
        vm.incomingJobs = [];

        activate();

        function activate() {
            
            var promises = [getDispatchReports(), getProductionUsers()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getDispatchReports(forceRefresh) {
            return datacontext.dispatchjob.getDeliveryReports(forceRefresh).then(function (data) {
                vm.deliveryreports = data;
                //console.log(vm.deliveryreports);
                return vm.deliveryreports;
            });
        }

        function getProductionUsers(forceRefresh) {
            return datacontext.inventaccount.getProductionStaffs(forceRefresh).then(function (data) {
                vm.users = data;
                //console.log(vm.users);
                return vm.users;
            });
        }

        function gotoJobDetails(entity) {
            if (entity && entity.id) {
                $location.path('in/dispatch/delivery-report/' + entity.id);
            }
        }

        function goBack() { $window.history.back(); }

    
    }
})();
