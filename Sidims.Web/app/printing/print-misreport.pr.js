(function () {
    'use strict';
    var controllerId = 'PrintMISReportPR';
    angular
        .module('app')
        .controller('PrintMISReportPR', PrintMISReportPR);

    PrintMISReportPR.$inject = ['$location', 'common', 'datacontext'];

    function PrintMISReportPR($location, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.gotoJobDetails = gotoJobDetails;
        vm.jobs = [];
        vm.misreports = [];

        activate();

        function activate() {
            
            var promises = [getPrintMISReports(), getJobTrackers(), getJobs()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getPrintMISReports(forceRefresh) {
            return datacontext.printingjob.getJobSplitPrintCEAnalysisReport(forceRefresh).then(function (data) {
                vm.misreports = data;
                //console.log(vm.misreports);
                return vm.misreports;
            });
        }

        function getJobTrackers(forceRefresh) {
            return datacontext.resourcejob.getJobTrackers(forceRefresh).then(function (data) {
                vm.jobTrackers = data;
                //console.log(vm.jobTrackers);
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

        function goBack() { $window.history.back(); }

    
    }
})();
