(function () {
    'use strict';
    var controllerId = 'RecentPendingJobSv';
    angular
        .module('app')
        .controller('RecentPendingJobSv', RecentPendingJobSv);

    RecentPendingJobSv.$inject = ['$location', '$routeParams', '$scope', 'common', 'config', 'datacontext', 'model', 'resourceService'];

    function RecentPendingJobSv($location, $routeParams, $scope, common, config, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;

        vm.jobs = [];

        activate();

        function activate() {
            initLookups();
       
            var promises = [getJobs()];
            common.activateController(promises, controllerId)
                .then(function () {
                    log('Activated Job Status View');
                });
        }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
        }

        function getJobs(forceRefresh) {
            return datacontext.resourcejob.getJobs(forceRefresh).then(function (data) {
                vm.jobs = data;
                return vm.jobs;
            });
        }

        function goBack() { $window.history.back(); }


    }

})();
