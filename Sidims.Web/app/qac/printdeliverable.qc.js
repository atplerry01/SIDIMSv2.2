(function () {
    'use strict';
    var controllerId = 'PrintDeliverableQC';
    angular
        .module('app')
        .controller('PrintDeliverableQC', PrintDeliverableQC);

    PrintDeliverableQC.$inject = ['$location', 'common', 'datacontext'];

    function PrintDeliverableQC($location, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.gotoJobDetails = gotoJobDetails;
        vm.jobs = [];
        vm.incomingPrints = [];

        activate();

        function activate() {
            var promises = [getPrintDeliverables(), getJobs()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getPrintDeliverables(forceRefresh) {
            return datacontext.printingjob.getPrintDeliverables(forceRefresh).then(function (data) {
                vm.incomingPrints = data;
                //console.log(vm.incomingPrints);
                return vm.incomingPrints;
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
                $location.path('/qc/print-pending-delivery/' + entity.id)
            }
        }

        function goBack() { $window.history.back(); }

    
    }
})();
