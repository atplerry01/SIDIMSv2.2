(function () {
    'use strict';
    var controllerId = 'JobArchiveIN';
    angular
        .module('app')
        .controller('JobArchiveIN', JobArchiveIN);

    JobArchiveIN.$inject = ['$location', '$routeParams', '$scope', 'common', 'config', 'datacontext', 'model', 'resourceService'];

    function JobArchiveIN($location, $routeParams, $scope, common, config, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;

        vm.jobTrackers = [];
        vm.jobs = [];
        vm.gotoAuditTrail = gotoAuditTrail;
        vm.refresh = refresh;

        vm.filteredJobTrackers = [];
        vm.jobTrackersSearch = '';
        vm.jobTrackersFilter = jobTrackersFilter;
        vm.search = search;

        vm.jobTrackerCount = 0;
        vm.jobTrackerFilteredCount = 0;
        vm.paging = {
            currentPage: 1,
            maxPagesToShow: 10,
            pageSize: 10
        };
        vm.pageChanged = pageChanged;

        Object.defineProperty(vm.paging, 'pageCount', {
            get: function () {
                return Math.floor(vm.jobTrackerFilteredCount / vm.paging.pageSize) + 1;
            }
        });


        activate();

        function activate() {
            initLookups();

            var promises = [getJobTrackers(), getJobs()];
            common.activateController(promises, controllerId)
                .then(function () {
                    log('Activated Job Status View');
                });
        }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
        }

        function getJobTrackers(forceRefresh) {
            return datacontext.resourcejob.getJobTrackers(forceRefresh,
                vm.paging.currentPage, vm.paging.pageSize, vm.jobTrackersSearch)
                .then(function (data) {
                    vm.jobTrackers = vm.filteredJobTrackers = data;
                    getJobTrackerFilteredCount();

                    if (!vm.jobTrackerCount || forceRefresh) {
                        getJobTrackerCount();
                    }

                    return data;

                });
        }

        function getJobTrackerCount() {
            return datacontext.resourcejob.getJobTrackerCount()
                .then(function (data) {
                    //console.log(data);
                    return vm.jobTrackerCount = data;
                });
        }

        function getJobTrackerFilteredCount() {
            vm.jobTrackerFilteredCount = datacontext.resourcejob.getJobTrackerFilteredCount(vm.jobTrackersSearch);
        }

        function search($event) {
            if ($event.keyCode === keyCodes.esc) {
                vm.jobTrackersSearch = '';
                applyFilter(true);
            } else {
                applyFilter();
            }

        }

        function applyFilter() {
            vm.filteredJobTrackers = vm.jobTrackers.filter(jobTrackersFilter);
        }

        function jobTrackersFilter(entity) {

            var textContains = common.textContains;
            var searchText = vm.jobTrackersSearch;

            var isMatch = searchText ?
                textContains(entity.job.jobName, searchText)
                    || textContains(entity.job.jobName, searchText)
                : true;

            return isMatch;

        }

        function pageChanged(page) {
            if (!page) { return; }
            vm.paging.currentPage = page;
            getJobTrackers();
        }


        function getJobs(forceRefresh) {
            return datacontext.resourcejob.getJobs(forceRefresh).then(function (data) {
                vm.jobs = data;
                return vm.jobs;
            });
        }

        function goBack() { $window.history.back(); }

        function gotoAuditTrail(entity) {
            window.open('#/job/audit-trail/' + entity.id, '_blank');
        }

        function refresh() {
            getJobTrackers(true);
            getJobs(true);
        }

    }

})();
