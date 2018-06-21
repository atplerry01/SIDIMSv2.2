(function () {
    'use strict';
    var controllerId = 'DeletedJobCO';

    angular
        .module('app')
        .controller('DeletedJobCO', DeletedJobCO);

    DeletedJobCO.$inject = ['$location', '$route', '$rootScope', '$scope', 'authService', 'common', 'config', 'datacontext', 'model', 'resourceService'];

    function DeletedJobCO($location, $route, $rootScope, $scope, authService, common, config, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;

        vm.fileType = 'asc';
        vm.jobFiles = jobFiles;
        vm.sortingFiles = sortingFiles;
        vm.otherFiles = otherFiles;

        vm.auth = authService.authentication;
        vm.gotoJobDetails = gotoJobDetails;
        vm.roles = [];
        vm.currnetRole = undefined;
        vm.refresh = refresh;
        vm.markUnTreated = markUnTreated;

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

            var promises = [getServerJobRefreshs(vm.fileType), roleSetups()];
            common.activateController(promises, controllerId)
                .then(function () {
                    log('Activated Dashboard View');
                });
        }

        function jobFiles() {
            vm.fileType = 'asc';
            getServerJobRefreshs(vm.fileType);
        }

        function sortingFiles() {
            vm.fileType = 'xls';
            getServerJobRefreshs(vm.fileType);
        }

        function otherFiles() {
            vm.fileType = '*';
            getServerJobRefreshs(vm.fileType);
        }

        function getServerJobRefreshs(fileType, forceRefresh) {
            return datacontext.resourcejob.getDeletedServerJobQueues(fileType, forceRefresh, vm.paging.currentPage, vm.paging.pageSize, vm.serverJobsSearch)
                .then(function (data) {
                    console.log(data);
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
            //getServerJobs(vm.fileType);
            getServerJobRefreshs(vm.fileType);
        }

        function pageChanged(page) {
            if (!page) { return; }
            vm.paging.currentPage = page;

            //getServerJobs(vm.fileType);
            getServerJobRefreshs(vm.fileType);
        }

        function markUnTreated(entity) {
            var newEntity = {
                id: entity.id,
                jobName: entity.jobName,
            };

            ServerJobMarkDeleted(newEntity);
        }

        function ServerJobMarkDeleted(entity) {
            var resourceUri = model.resourceUri.co + '/serverjob/undelete';
            resourceService.updateResource(resourceUri, entity).then(function (response) {
                getServerJobRefreshs();
            },
			 function (response) {
			     console.log(response);
			     $scope.message = "Failed to save resource due to:";
			 });
        }

        function roleSetups() {
            var auth = authService.authentication;
            var page = auth.page;
            vm.currnetRole = page;
        }

        function refresh() { getServerJobs(vm.fileType, true); }

        function initSetups() {
            var auth = authService.authentication;
            if (auth.roles !== "") {
                var page = auth.page;
                vm.currnetRole = page;
            }
        }

        function gotoJobDetails(entity) {
            if (entity && entity.id && vm.currnetRole === "CardOps") {
                $location.path('/co/job-setup/' + entity.id)
            }
        }

    }
})();
