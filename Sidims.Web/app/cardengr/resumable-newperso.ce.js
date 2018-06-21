(function () {
    'use strict';
    var controllerId = 'ResumableNewPersoCE';
    angular
        .module('app')
        .controller('ResumableNewPersoCE', ResumableNewPersoCE);

    ResumableNewPersoCE.$inject = ['$location', 'common', 'datacontext'];

    function ResumableNewPersoCE($location, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.gotoJobDetails = gotoJobDetails;
        vm.jobs = [];
        vm.resumeNewPersos = [];

        activate();

        function activate() {
            
            var promises = [getResumableNewPersos(), getJobs()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getResumableNewPersos(forceRefresh) {
            return datacontext.cardengrjob.getResumableNewPersos(forceRefresh).then(function (data) {
                vm.resumeNewPersos = data;
                //console.log(vm.resumeNewPersos);
                return vm.resumeNewPersos;
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
                $location.path('/ce/resumable/new-perso/' + entity.id)
            }
        }

        function goBack() { $window.history.back(); }

    
    }
})();
