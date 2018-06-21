(function () {
    'use strict';
    var controllerId = 'JobPersoReportCE';
    angular
        .module('app')
        .controller('JobPersoReportCE', JobPersoReportCE);

    JobPersoReportCE.$inject = ['$location', '$routeParams', '$scope', '$timeout', 'common', 'config', 'datacontext', 'model', 'resourceService'];

    function JobPersoReportCE($location, $routeParams, $scope, $timeout, common, config, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;

        vm.splitceanalysis = [];

        activate();

        function activate() {
            initLookups();

            var promises = [getJobSplitCEAnalysis(), getJobTrackers(), getJobs(), getJobSplits(), getProductionStaffs()];
            common.activateController(promises, controllerId)
                .then(function () {
                    log('Activated Job Status View');
                });
        }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
        }

        //get JobSpliCEAnalysis
        function getJobSplitCEAnalysis(forceRefresh) {
            var department = "Card Engineer"
            return datacontext.resourcejob.getJobSplitCEAnalysisByDepartment(department, forceRefresh).then(function (data) {
                vm.splitceanalysis = data;
               
                //console.log(vm.splitceanalysis);
                return vm.splitceanalysis;
            });
        }

        function getJobSplits(forceRefresh) {
            return datacontext.resourcejob.getJobSplits(forceRefresh).then(function (data) {
                vm.jobsplits = data;
                return vm.jobsplits;
            });
        }

        function getJobTrackers(forceRefresh) {
            return datacontext.resourcejob.getJobTrackers(forceRefresh).then(function (data) {
                vm.jobtrackers = data;
                return vm.jobtrackers;
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
