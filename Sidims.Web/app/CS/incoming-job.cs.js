(function () {
    'use strict';
    var controllerId = 'IncomingJobCS';
    angular
        .module('app')
        .controller('IncomingJobCS', IncomingJobCS);

    IncomingJobCS.$inject = ['$location', 'common', 'datacontext'];

    function IncomingJobCS($location, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.jobs = [];
        vm.incomingJobs = [];
        vm.gotoJobDetails = gotoJobDetails;

        activate();

        function activate() {
            var promises = [getIncomingJobs(), getJobs(), getProductionUsers()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getIncomingJobs(forceRefresh) {
            return datacontext.customerservice.getIncomingJobs(forceRefresh).then(function (data) {
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

        function getProductionUsers(forceRefresh) {
            return datacontext.inventaccount.getProductionStaffs(forceRefresh).then(function (data) {
                vm.users = data;
                //console.log(vm.users);
                return vm.users;
            });
        }

        function gotoJobDetails(entity) {
            if (entity && entity.id) {
                $location.path('/cs/jobdetail/' + entity.id);
            }
        }
     
        function goBack() { $window.history.back(); }

    
    }
})();
