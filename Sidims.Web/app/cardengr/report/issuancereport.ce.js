(function () {
    'use strict';
    var controllerId = 'IssuanceReportCE';
    angular
        .module('app')
        .controller('IssuanceReportCE', IssuanceReportCE);

    IssuanceReportCE.$inject = ['$location', '$routeParams', '$scope', '$timeout', 'common', 'config', 'datacontext', 'model', 'resourceService'];

    function IssuanceReportCE($location, $routeParams, $scope, $timeout, common, config, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;

        vm.cardIssuancelogs = [];

        activate();

        function activate() {
            initLookups();

            var promises = [getCardIssuanceLogs(), getCardIssuance(), getJobs(), getProductionStaffs()];
            common.activateController(promises, controllerId)
                .then(function () {
                    //applyFilter = common.createSearchThrottle(vm, 'serverJobs');
                    //if (vm.jobTrackersSearch) { applyFilter(true); }
                    log('Activated Job Status View');
                });
        }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
        }

        // get IssuanceLog
        function getCardIssuanceLogs(forceRefresh) {
            return datacontext.inventjob.getCardIssuanceLogs(forceRefresh).then(function (data) {
                vm.cardIssuancelogs = data;
                //console.log(vm.cardIssuancelogs);
                return vm.cardIssuancelogs;
            });
        }

        function getCardIssuance(forceRefresh) {
            return datacontext.inventjob.getCardIssuances(forceRefresh).then(function (data) {
                vm.cardIssuances = data;
                return vm.cardIssuances;
            });
        }

        function getJobs(forceRefresh) {
            return datacontext.resourcejob.getJobs(forceRefresh).then(function (data) {
                vm.jobs = data;
                return vm.jobs;
            });
        }

        function getProductionStaffs(forceRefresh) {
            return datacontext.inventaccount.getProductionStaffs(forceRefresh).then(function (data) {
                vm.staffs = data;
                //console.log(vm.staffs);
                return vm.staffs;
            });
        }

        function goBack() { $window.history.back(); }


    }

})();
