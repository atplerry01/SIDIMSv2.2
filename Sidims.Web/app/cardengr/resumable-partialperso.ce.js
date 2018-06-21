(function () {
    'use strict';
    var controllerId = 'ResumablePartialPersoCE';
    angular
        .module('app')
        .controller('ResumablePartialPersoCE', ResumablePartialPersoCE);

    ResumablePartialPersoCE.$inject = ['$location', 'common', 'datacontext'];

    function ResumablePartialPersoCE($location, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.gotoJobDetails = gotoJobDetails;
        vm.jobs = [];
        vm.resumePartialPersos = [];

        activate();

        function activate() {
            
            var promises = [getResumablePartialPersos(), getJobs()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getResumablePartialPersos(forceRefresh) {
            return datacontext.cardengrjob.getResumablePartialPersos(forceRefresh).then(function (data) {
                vm.resumePartialPersos = data;
                //console.log(vm.resumePartialPersos);
                return vm.resumePartialPersos;
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
                //console.log(entity.job.id);
                $location.path('/ce/first-card/' + entity.job.id)
            }
        }

        function goBack() { $window.history.back(); }

    
    }
})();
