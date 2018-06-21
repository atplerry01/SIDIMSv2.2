(function () {
    'use strict';
    var controllerId = 'PrintAnalysisPR';
    angular
        .module('app')
        .controller('PrintAnalysisPR', PrintAnalysisPR);

    PrintAnalysisPR.$inject = ['$location', 'common', 'datacontext'];

    function PrintAnalysisPR($location, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.gotoJobDetails = gotoJobDetails;
        vm.jobs = [];
        vm.printanalysis = [];

        activate();

        function activate() {
            
            var promises = [getgPrintAnalysis(), getJobs()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }


        function getgPrintAnalysis(forceRefresh) {
            return datacontext.printingjob.getPrintAnalysis(forceRefresh).then(function (data) {
                vm.printanalysis = data;
                //console.log(vm.printanalysis);
                return vm.printanalysis;
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
                $location.path('/pr/print-analysis/' + entity.id)
            }
        }

        function goBack() { $window.history.back(); }

    
    }
})();
