(function () {
    'use strict';
    var controllerId = 'IncomingPersoCE';
    angular
        .module('app')
        .controller('IncomingPersoCE', IncomingPersoCE);

    IncomingPersoCE.$inject = ['$location', 'common', 'datacontext'];

    function IncomingPersoCE($location, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.gotoJobDetails = gotoJobDetails;
        vm.jobs = [];
        vm.incomingPersos = [];

        activate();

        function activate() {
            var promises = [getIncomingPersos(), getJobs()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getIncomingPersos(forceRefresh) {
            return datacontext.cardengrjob.getIncomingPersos(forceRefresh).then(function (data) {
                vm.incomingPersos = data;
                return vm.incomingPersos;
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
                $location.path('ce/first-card/' + entity.id);
            }
        }

        function goBack() { $window.history.back(); }

    }
})();
