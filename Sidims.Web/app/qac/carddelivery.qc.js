(function () {
    'use strict';
    var controllerId = 'CardDeliveryQC';
    angular
        .module('app')
        .controller('CardDeliveryQC', CardDeliveryQC);

    CardDeliveryQC.$inject = ['$location', '$routeParams', 'common', 'datacontext'];

    function CardDeliveryQC($location, $routeParams, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.gotoJobDetails = gotoJobDetails;
        vm.qcpendingdelivery = [];

        activate();

        function activate() {
            var promises = [getQCPendingDelivery(), getJobs()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getQCPendingDelivery(forceRefresh) {
            return datacontext.qacjob.getQCPendingDelivery(forceRefresh).then(function (data) {
                vm.qcpendingdelivery = data;
                return vm.qcpendingdelivery;
            });
        }

        function getJobs(forceRefresh) {
            return datacontext.inventjob.getJobs(forceRefresh).then(function (data) {
                vm.jobs = data;
                return vm.jobs;
            });
        }

        function gotoJobDetails(entity) {
            if (entity && entity.id) {
                $location.path('/qc/card-pending-delivery/' + entity.id);
            }
        }

        function goBack() { $window.history.back(); }

    
    }
})();
