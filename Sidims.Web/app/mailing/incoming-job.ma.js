(function () {
    'use strict';
    var controllerId = 'IncomingJobMA';
    angular
        .module('app')
        .controller('IncomingJobMA', IncomingJobMA);

    IncomingJobMA.$inject = ['$location', 'common', 'datacontext'];

    function IncomingJobMA($location, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.gotoJobDetails = gotoJobDetails;
        vm.jobs = [];
        vm.mailingIncomingPersos = [];

        activate();

        function activate() {
            var promises = [getMAIncomingPersos(), getJobs()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        //IncomingJobs => CE1 ==Queue
        function getMAIncomingPersos(forceRefresh) {
            return datacontext.mailingjob.getMAIncomingPersos(forceRefresh).then(function (data) {
                vm.mailingIncomingPersos = data;
                //console.log(vm.mailingIncomingPersos);
                return vm.mailingIncomingPersos;
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
                $location.path('/ma/start-job/' + entity.id)
            }
        }

        function goBack() { $window.history.back(); }

    
    }
})();
