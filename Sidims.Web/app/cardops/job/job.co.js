(function () {
    'use strict';
    var controllerId = 'JobCO';
    angular
        .module('app')
        .controller('JobCO', JobCO);

    JobCO.$inject = ['$location', 'common', 'datacontext'];

    function JobCO($location, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.gotoJobDetails = gotoJobDetails;
        vm.jobs = [];

        activate();

        function activate() {
            
            var promises = [getJobs()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getJobs(forceRefresh) {
            return datacontext.resourcejob.getJobs(forceRefresh).then(function (data) {
                vm.jobs = data;
                return vm.jobs;
            });
        }

        function gotoJobDetails(entity) {
            if (entity && entity.id) {
                $location.path('/co/job-setup-update/' + entity.id)
            }
        }

        function goBack() { $window.history.back(); }

    
    }
})();
