(function () {
    'use strict';
    var controllerId = 'PendingJobCO';

    angular
        .module('app')
        .controller('PendingJobCO', PendingJobCO);

    PendingJobCO.$inject = ['$location', '$route', '$rootScope', '$scope', 'authService', 'common', 'config', 'datacontext', 'model', 'resourceService'];

    function PendingJobCO($location, $route, $rootScope, $scope, authService, common, config, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;

        vm.auth = authService.authentication;
        vm.gotoJobDetails = gotoJobDetails;
        vm.roles = [];
        vm.currnetRole = undefined;
        vm.refresh = refresh;
        vm.markTreated = markTreated;

        vm.serverJobs = [];
        vm.filteredServerJobs = [];
        vm.serverJobsSearch = '';
        vm.search = search;

        vm.serverJobCount = 0;
        vm.serverJobFilteredCount = 0;
        vm.paging = {
            currentPage: 1,
            maxPagesToShow: 10,
            pageSize: 10
        };
        vm.pageChanged = pageChanged;

        Object.defineProperty(vm.paging, 'pageCount', {
            get: function () {
                return Math.floor(vm.serverJobFilteredCount / vm.paging.pageSize) + 1;
            }
        });

        activate();

        function activate() {
            initSetups();

            var promises = [getServerJobs(true), roleSetups()];
            common.activateController(promises, controllerId)
                .then(function () {
                    log('Activated Dashboard View');
                });
        }

        function getServerJobs(forceRefresh) {
            return datacontext.resourcejob.getServerJobQueues(forceRefresh, vm.paging.currentPage, vm.paging.pageSize, vm.serverJobsSearch)
                .then(function (data) {
                    vm.serverJobs = vm.filteredServerJobs = data;
                    if (!vm.serverJobCount || forceRefresh) {
                        getServerJobCount();
                    }
                    getServerJobFilteredCount();
                    return data;
                });
        }

        function getServerJobCount() {
            return datacontext.resourcejob.getServerJobCount().then(function (data) {
                return vm.serverJobCount = data;
            });
        }

        function getServerJobFilteredCount() {
            vm.serverJobFilteredCount = datacontext.resourcejob.getServerJobFilteredCount(vm.serverJobsSearch);
        }

        function search($event) {
            if ($event.keyCode === keyCodes.esc) { vm.serverJobsSearch = ''; }
            getServerJobs();
        }

        function pageChanged(page) {
            if (!page) { return; }
            vm.paging.currentPage = page;
            getServerJobs();
        }

        function markTreated(entity) {
            var newEntity = {
                id: entity.id,
                jobName: entity.jobName,
            };

            ServerJobMarkDeleted(newEntity);
        }

        function ServerJobMarkDeleted(entity) {
            var resourceUri = model.resourceUri.co + '/serverjob/delete';
            resourceService.updateResource(resourceUri, entity).then(function (response) {
                //console.log(response);
                getServerJobs(true);
            },
			 function (response) {
			     //console.log(response);
			     $scope.message = "Failed to save resource due to:";
			 });
        }

        function gotoJobDetails(entity) {
            //if (entity && entity.id && vm.currnetRole === "CardOps") {
            //    $location.path('/co/job-setup/' + entity.id)
            //}
        }

        function roleSetups() {
            var auth = authService.authentication;
            var roles = JSON.parse(auth.roles);
            vm.currnetRole = roles[0];
        }

        function refresh() { getServerJobs(true); }

        function initSetups() {
            var auth = authService.authentication;
            if (auth.roles !== "") {
                var roles = JSON.parse(auth.roles);
                vm.currnetRole = roles[0];
            }
        }


    }
})();
