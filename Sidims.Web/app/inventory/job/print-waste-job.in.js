(function () {
    'use strict';
    var controllerId = 'PrintWasteJobIN';
    angular
        .module('app')
        .controller('PrintWasteJobIN', PrintWasteJobIN);

    PrintWasteJobIN.$inject = ['$location', 'common', 'datacontext'];

    function PrintWasteJobIN($location, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.gotoWasteIssuances = gotoWasteIssuances;

        vm.wastejobs = [];

        activate();

        function activate() {
            //getJobs(), getJobTrackers()
            var promises = [getWasteJobs(), getJobs(), getJobTrackers()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getWasteJobs(forceRefresh) {
            return datacontext.inventjob.getApprovedPrintWastes(forceRefresh).then(function (data) {
                vm.wastejobs = data;
                //console.log(vm.wastejobs);
                return vm.wastejobs;
            });
        }

        function goBack() { $window.history.back(); }

        function gotoWasteIssuances(entity) {
            if (entity && entity.id) {
                $location.path('/in/print-waste-issuance/' + entity.id)
            }
        }
    
        function getJobs(forceRefresh) {
            return datacontext.resourcejob.getIncompleteJobs(forceRefresh).then(function (data) {
                vm.jobs = data;
                return vm.jobs;
            });
        }

        function getJobTrackers(forceRefresh) {
            return datacontext.resourcejob.getJobTrackers(forceRefresh).then(function (data) {
                vm.jobTrackers = data;
                return vm.jobTrackers;
            });
        }


    }
})();
