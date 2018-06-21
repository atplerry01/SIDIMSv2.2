(function () {
    'use strict';
    var controllerId = 'NonPersoJobCO';
    angular
        .module('app')
        .controller('NonPersoJobCO', NonPersoJobCO);

    NonPersoJobCO.$inject = ['$location', 'common', 'datacontext'];

    function NonPersoJobCO($location, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.gotoJobDetails = gotoJobDetails;
        vm.jobs = [];

        activate();

        function activate() {
            
            var promises = [getNonPersoJobs(), getRMUsers()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getNonPersoJobs(forceRefresh) {
            return datacontext.resourcejob.getNonPersoJobs(forceRefresh).then(function (data) {
                vm.jobs = data;
                //console.log(vm.jobs);
                return vm.jobs;
            });
        }

        function getRMUsers(forceRefresh) {
            return datacontext.rm.getRMUsers(forceRefresh).then(function (data) {
                vm.users = data;
                //console.log(vm.users);
                return vm.users;
            });
        }

        function gotoJobDetails(entity) {
            if (entity && entity.id) {
                $location.path('/co/nonperso-job/' + entity.id)
            }
        }

        function goBack() { $window.history.back(); }

    
    }
})();
