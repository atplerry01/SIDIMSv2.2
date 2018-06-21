(function () {
    'use strict';
    var controllerId = 'PrintDeliverablePR';
    angular
        .module('app')
        .controller('PrintDeliverablePR', PrintDeliverablePR);

    PrintDeliverablePR.$inject = ['$location', 'common', 'datacontext'];

    function PrintDeliverablePR($location, common, datacontext) {
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
