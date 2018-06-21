(function () {
    'use strict';
    var controllerId = 'WasteJobIN';
    angular
        .module('app')
        .controller('WasteJobIN', WasteJobIN);

    WasteJobIN.$inject = ['$location', 'common', 'datacontext'];

    function WasteJobIN($location, common, datacontext) {
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
            return datacontext.inventjob.getApprovedCardWastes(forceRefresh).then(function (data) {
                vm.wastejobs = data;
                ////////console.log(vm.wastejobs);
                return vm.wastejobs;
            });
        }

        function goBack() { $window.history.back(); }

        function gotoWasteIssuances(entity) {
            if (entity && entity.id) {
                $location.path('/in/waste-issuance/' + entity.id)
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
