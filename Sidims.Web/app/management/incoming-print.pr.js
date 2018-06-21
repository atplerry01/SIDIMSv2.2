(function () {
    'use strict';
    var controllerId = 'IncomingPrintPR';
    angular
        .module('app')
        .controller('IncomingPrintPR', IncomingPrintPR);

    IncomingPrintPR.$inject = ['$location', 'common', 'datacontext'];

    function IncomingPrintPR($location, common, datacontext) {
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

        //IncomingJobs => PR ==Queue
        function getIncomingPrints(forceRefresh) {
            return datacontext.printingjob.getIncomingPrints(forceRefresh).then(function (data) {
                vm.incomingPrints = data;
                //console.log(vm.incomingPrints);
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
                $location.path('/pr/print-job/' + entity.id)
            }
        }

        function goBack() { $window.history.back(); }

    
    }
})();
