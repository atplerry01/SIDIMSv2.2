(function () {
    'use strict';
    var controllerId = 'PendingPersoQC';
    angular
        .module('app')
        .controller('PendingPersoQC', PendingPersoQC);

    PendingPersoQC.$inject = ['$location', 'common', 'datacontext'];

    function PendingPersoQC($location, common, datacontext) {
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
            return datacontext.qacjob.getQCPendingPersos(forceRefresh).then(function (data) {
                vm.qcIncomingPersos = data;
                //console.log(vm.qcIncomingPersos);
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
