(function () {
    'use strict';
    var controllerId = 'IncomingPrintQA';
    angular
        .module('app')
        .controller('IncomingPrintQA', IncomingPrintQA);

    IncomingPrintQA.$inject = ['$location', 'common', 'datacontext'];

    function IncomingPrintQA($location, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.gotoJobDetails = gotoJobDetails;
        vm.jobs = [];
        vm.qaIncomingPersos = [];

        activate();

        function activate() {
            var promises = [getQAIncomingPrints(), getJobs()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        //IncomingJobs => CE1 ==Queue
        function getQAIncomingPrints(forceRefresh) {
            return datacontext.qacjob.getQAIncomingPrints(forceRefresh).then(function (data) {
                vm.qaIncomingPersos = data;
                //console.log(vm.qaIncomingPersos);
                return vm.qaIncomingPersos;
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
                $location.path('/qa/print-jobsplit-lists/' + entity.id);
            }
        }

        function goBack() { $window.history.back(); }

    
    }
})();
