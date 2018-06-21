(function () {
    'use strict';
    var controllerId = 'dashboard';

    angular
        .module('app')
        .controller('dashboard', dashboard);

    dashboard.$inject = ['$location', '$route', '$rootScope', '$scope', '$timeout', 'authService', 'common', 'config', 'datacontext', 'model', 'resourceService'];

    function dashboard($location, $route, $rootScope, $scope, $timeout, authService, common, config, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;

        vm.fileType = 'asc';
        vm.auth = authService.authentication;
        vm.gotoJobDetails = gotoJobDetails;
        vm.roles = [];
        vm.currnetRole = undefined;
        vm.refresh = refresh;
        vm.markTreated = markTreated;

        vm.recentServerJobs = [];
        vm.recentFilteredServerJobs = [];
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

        function getServerJobRefreshs(fileType, forceRefresh) {
            return datacontext.resourcejob.getRecentServerJobQueues2(fileType, forceRefresh, vm.paging.currentPage, vm.paging.pageSize, vm.serverJobsSearch)
                .then(function (data) {
                    vm.recentServerJobs = vm.recentFilteredServerJobs = data;
                    if (!vm.serverJobCount || forceRefresh) {
                        getServerJobCount();
                    }
                    getServerJobFilteredCount();
                    return data;
                });
        }

        function getServerJobs(fileType, forceRefresh) {
            return datacontext.resourcejob.getRecentServerJobQueues(fileType, forceRefresh, vm.paging.currentPage, vm.paging.pageSize, vm.serverJobsSearch)
                .then(function (data) {
                    vm.recentServerJobs = vm.recentFilteredServerJobs = data;
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
            getServerJobs(vm.fileType);
        }

        function pageChanged(page) {
            if (!page) { return; }
            vm.paging.currentPage = page;
            getServerJobs(vm.fileType);
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
                getServerJobRefreshs();                
            },
			 function (response) {
			     $scope.message = "Failed to save resource due to:";
			 });
        }

        function gotoJobDetails(entity) {
            if (entity && entity.id) {
                if (vm.currnetRole === "CardOps" || vm.currnetRole === "CardOps Supervisor") {
                    $location.path('/co/job-setup/' + entity.id);
                }
            }
        }

        function roleSetups() {
            var auth = authService.authentication;
            var page = auth.page;
            vm.currnetRole = page;
        }

        function refresh() {
            getServerJobRefreshs(vm.fileType);
        }

        function initSetups() {
            var auth = authService.authentication;
            if (auth.roles !== "") {
                var page = auth.page;
                vm.currnetRole = page;
            }
        }


    }
})();
