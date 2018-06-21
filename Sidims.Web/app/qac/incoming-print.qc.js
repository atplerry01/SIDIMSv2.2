(function () {
    'use strict';
    var controllerId = 'IncomingPrintQC';
    angular
        .module('app')
        .controller('IncomingPrintQC', IncomingPrintQC);

    IncomingPrintQC.$inject = ['$location', 'common', 'datacontext'];

    function IncomingPrintQC($location, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.gotoJobDetails = gotoJobDetails;
        vm.jobs = [];
        vm.qcIncomingPrints = [];

        activate();

        function activate() {
            var promises = [getQCIncomingPrints(), getJobs()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getQCIncomingPrints(forceRefresh) {
            return datacontext.qacjob.getQCIncomingPrints(forceRefresh).then(function (data) {
                vm.qcIncomingPrints = data;
                //console.log(vm.qcIncomingPrints);
                return vm.qcIncomingPrints;
            });
        }



        //Todo
        function getJobs(forceRefresh) {
            return datacontext.inventjob.getJobs(forceRefresh).then(function (data) {
                vm.jobs = data;
                return vm.jobs;
            });
        }

        function gotoJobDetails(entity) {
            if (entity && entity.id) {
                $location.path('/qc/run-job-print/' + entity.id)
            }
        }

        function goBack() { $window.history.back(); }

    
    }
})();
