(function () {
    'use strict';
    var controllerId = 'CardDeliveryReportCE';
    angular
        .module('app')
        .controller('CardDeliveryReportCE', CardDeliveryReportCE);

    CardDeliveryReportCE.$inject = ['$location', 'common', 'datacontext'];

    function CardDeliveryReportCE($location, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.gotoJobDetails = gotoJobDetails;
        vm.jobs = [];
        vm.carddeliveryreports = [];

        activate();

        function activate() {
            var promises = [getCardDeliveryReports(), getJobTrackers(), getJobs(), getProductionStaffs()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getCardDeliveryReports(forceRefresh) {
            return datacontext.cardengrjob.getCECardDelivery(forceRefresh).then(function (data) {
                vm.carddeliveryreports = data;
                return vm.carddeliveryreports;
            });
        }

        function getJobTrackers(forceRefresh) {
            return datacontext.resourcejob.getJobTrackers(forceRefresh).then(function (data) {
                vm.jobTrackers = data;
                return vm.jobTrackers;
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
                $location.path('/pr/print-job/' + entity.id)
            }
        }

        function getProductionStaffs(forceRefresh) {
            return datacontext.inventaccount.getProductionStaffs(forceRefresh).then(function (data) {
                vm.collectors = data;
                return vm.collectors;
            });
        }

        function goBack() { $window.history.back(); }

    
    }
})();
