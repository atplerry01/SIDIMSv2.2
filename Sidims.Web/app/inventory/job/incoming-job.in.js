(function () {
    'use strict';
    var controllerId = 'IncomingJobIN';
    angular
        .module('app')
        .controller('IncomingJobIN', IncomingJobIN);

    IncomingJobIN.$inject = ['$location', 'common', 'datacontext'];

    function IncomingJobIN($location, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.gotoJobDetails = gotoJobDetails;
        vm.jobs = [];
        vm.incomingJobs = [];

        activate();

        function activate() {
            
            var promises = [getIncomingJobs(), getJobs()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getIncomingJobs(forceRefresh) {
            return datacontext.inventjob.getIncomingJobs(forceRefresh).then(function (data) {
                vm.incomingJobs = data;
                //console.log(vm.incomingJobs);
                return vm.incomingJobs;
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
                $location.path('/in/card-setup/' + entity.id)
            }
        }

        function goBack() { $window.history.back(); }

    
    }
})();
