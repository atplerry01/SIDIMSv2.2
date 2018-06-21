(function () {
    'use strict';
    var controllerId = 'JobDeliveryReportCE';
    angular
        .module('app')
        .controller('JobDeliveryReportCE', JobDeliveryReportCE);

    JobDeliveryReportCE.$inject = ['$location', '$routeParams', '$scope', '$timeout', 'common', 'config', 'datacontext', 'model', 'resourceService'];

    function JobDeliveryReportCE($location, $routeParams, $scope, $timeout, common, config, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;

        vm.carddeliverylogs = [];
        vm.getTargetDepartment = getTargetDepartment;

        activate();

        function activate() {
            initLookups();

            var promises = [getCardDeliveryLogs(), getCECardDelivery(), getJobTrackers(), getJobs(), getProductionStaffs()];
            common.activateController(promises, controllerId)
                .then(function () {
                    //applyFilter = common.createSearchThrottle(vm, 'serverJobs');
                    //if (vm.jobTrackersSearch) { applyFilter(true); }
                    log('Activated Job Status View');
                });
        }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            vm.departments = lookups.departments;

            //console.log(vm.departments);
        }

        function getCardDeliveryLogs(forceRefresh) {
            return datacontext.resourcejob.getCECardDeliveryLogs(forceRefresh).then(function (data) {
                vm.carddeliverylogs = data;
                //console.log(vm.carddeliverylogs);
                return vm.carddeliverylogs;
            });
        }

        function getCECardDelivery(forceRefresh) {
            return datacontext.resourcejob.getCECardDeliverys(forceRefresh).then(function (data) {
                vm.carddeliverys = data;
                //console.log(vm.carddeliverys);
                return vm.carddeliverys;
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

        function getTargetDepartment(depatmentId) {
            var total = 0;
            for (var i = 0; i < vm.departments.length; i++) {
                var unitEntity = vm.departments[i];
                if (unitEntity.id == depatmentId) {
                    total = unitEntity.name;
                }
            }
            return total;
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
