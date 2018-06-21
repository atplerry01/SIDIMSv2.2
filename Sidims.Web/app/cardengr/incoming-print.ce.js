(function () {
    'use strict';
    var controllerId = 'IncomingPrintCE';
    angular
        .module('app')
        .controller('IncomingPrintCE', IncomingPrintCE);

    IncomingPrintCE.$inject = ['$location', 'common', 'datacontext'];

    function IncomingPrintCE($location, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.gotoJobDetails = gotoJobDetails;
        vm.jobs = [];
        vm.incomingPrints = [];

        activate();

        function activate() {
            
            var promises = [getIncomingPrints(), getJobs()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getIncomingPrints(forceRefresh) {
            return datacontext.cardengrjob.getIncomingPrints(forceRefresh).then(function (data) {
                vm.incomingPrints = data;
                return vm.incomingPrints;
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
                $location.path('/in/card-issuance/' + entity.job.id)
            }
        }

        function goBack() { $window.history.back(); }

    
    }
})();
