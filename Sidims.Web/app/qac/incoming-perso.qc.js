(function () {
    'use strict';
    var controllerId = 'IncomingPersoQC';
    angular
        .module('app')
        .controller('IncomingPersoQC', IncomingPersoQC);

    IncomingPersoQC.$inject = ['$location', 'common', 'datacontext'];

    function IncomingPersoQC($location, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.gotoJobDetails = gotoJobDetails;
        vm.jobs = [];
        vm.qcIncomingPersos = [];

        activate();

        function activate() {
            var promises = [getQCIncomingPersos(), getJobs()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        //IncomingJobs => CE1 ==Queue
        function getQCIncomingPersos(forceRefresh) {
            return datacontext.qacjob.getQCIncomingPersos(forceRefresh).then(function (data) {
                vm.qcIncomingPersos = data;
                return vm.qcIncomingPersos;
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
                $location.path('/qc/run-job/' + entity.id)
            }
        }

        function goBack() { $window.history.back(); }

    
    }
})();
