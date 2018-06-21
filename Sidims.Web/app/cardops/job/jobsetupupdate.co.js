(function () {
    'use strict';
    var controllerId = 'JobSetupUpdateCO';
    angular
        .module('app')
        .controller('JobSetupUpdateCO', JobSetupUpdateCO);

    JobSetupUpdateCO.$inject = ['$location', '$routeParams', '$scope', 'config', 'common', 'datacontext', 'model', 'resourceService'];

    function JobSetupUpdateCO($location, $routeParams, $scope, config, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;
        //vm.gotoAddVariant = gotoAddVariant;

        vm.isQuantityEditable = false;
        vm.jobId = $routeParams.id;
        vm.serverJob = undefined;
        vm.job = [];
        vm.goBack = goBack;
        vm.gotoJobDetails = gotoJobDetails;
        vm.updateClientList = updateClientList;

        vm.save = saveJob;
        vm.clients = [];
        vm.newClientInfo = [];
        vm.jobTypes = [];
        vm.remarks = [];
        vm.sectors = [];
        vm.priority = [];
        vm.sidVariants = [];
        vm.sidCardTypes = [];

        vm.jobsetup = {};

        vm.jobNames = [];
        vm.jobName = undefined;
        vm.jobQuantity;

        vm.serverJobs = [];
        vm.filteredServerJobs = [];
        vm.serverJobsSearch = '';
        vm.search = search;

        vm.serverJobCount = 0;
        vm.serverJobFilteredCount = 0;
        vm.paging = {
            currentPage: 1,
            maxPagesToShow: 10,
            pageSize: 20
        };
        vm.pageChanged = pageChanged;

        Object.defineProperty(vm.paging, 'pageCount', {
            get: function () {
                return Math.floor(vm.serverJobFilteredCount / vm.paging.pageSize) + 1;
            }
        });

        vm.errorMessage = '';

        activate();

        function activate() {
            initLookups();

            var promises = [getRequestedJob()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Variants View'); });
        }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            vm.clients = lookups.clients;
            vm.remarks = lookups.remarks;
            vm.sidCardTypes = lookups.sidCardTypes;
            vm.dictionaryClientNames = lookups.dictionaryClientNames;
            vm.dictionaryCardTypes = lookups.dictionaryCardTypes;
            vm.dictionaryServiceTypes = lookups.dictionaryServiceTypes;
        }

        function getRequestedJob() {
            var val = $routeParams.id;

            if (val) {
                return datacontext.resourcejob.getJobByTrackerId(val)
                .then(function (data) {
                    vm.jobsetup = data[0];
                    //console.log(vm.jobsetup);
                    //console.log(vm.jobsetup.sidClient);
                    getJobByTrackerId(val);
                    return vm.jobsetup;
                }, function (error) {
                    logError('Unable to get variant ' + val);
                });
            }
        }

        function getJobByTrackerId(jobTrackerId) {
            return datacontext.resourcejob.getJobTrackerById(jobTrackerId)
                .then(function (data) {
                    vm.jobTracker = data;

                    if (vm.jobTracker.stage02Inventory.name == 'Queue') {
                        //console.log('false');
                        vm.isQuantityEditable = true;
                    };

                    return vm.jobTracker;
                }, function (error) {
                    logError('Unable to get JobTracker ' + jobTrackerId);
                });
        }

        function gotoJobDetails(entity) {
            //console.log(entity);
            if (entity && entity.id) {
                $location.path('/co/job-setup/' + entity.id);
            }
        }

        function goBack() { $window.history.back(); }

        function saveJob() {
            var val = $routeParams.id;

            if (document.getElementById('jobName').value === ""
                 || document.getElementById('jobName').value === undefined) {
                alert("Please select a valid Job Name");
                return false;
            }

            if (document.getElementById('remark').value === ""
                || document.getElementById('remark').value === undefined) {

                //return false;
            } else {
                vm.remark = vm.jobsetup.remark.id;
            }

            //if (vm.jobsetup.remark !== undefined) {
            //    vm.newJob.remarkId = vm.jobsetup.remark.id;
            //}

            //console.log(vm.jobsetup);

            //if (vm.jobsetup.remark !== undefined || vm.jobsetup.remark !== null || vm.jobsetup.remark !== "" ) {
            //    vm.remark = vm.jobsetup.remark.id;
            //}

            //var remarkValue;
            //if (vm.jobsetup.remarks === undefined) {
            //    remarkValue = '';
            //} else {
            //    remarkValue = vm.jobsetup.remarks.name;
            //}

            if (vm.jobsetup.jobName !== null || vm.jobsetup.jobName !== undefined) {
                vm.newJob = {
                    id: vm.jobsetup.id,
                    jobName: vm.jobsetup.jobName,
                    jobNameId: vm.jobsetup.jobNameId,
                    //sidSectorId: vm.jobsetup.sector.id,
                    sidClientId: vm.jobsetup.sidClient.id,
                    sidCardTypeId: vm.jobsetup.sidCardType.id,
                    remarkId: vm.remark,
                    //ServiceTypeId: vm.jobsetup.serviceType.id,
                    quantity: vm.jobsetup.quantity
                };

                //console.log(vm.newJob);
                updateEntity(vm.newJob);
            } else {
                //console.log('error');
                vm.errorMessage = 'No Job Selected';
            }

        }

        function updateEntity(entity) {
            var resourceUri = model.resourceUri.co + '/job/update';
            resourceService.updateResource(resourceUri, entity).then(function (response) {
                vm.serverJob = {};
                vm.jobsetup = {};
                gotoJobStatus();
            });
        }

        function gotoJobStatus() {
            $location.path('/job-status');
        }

        function updateClientList(entity) {
            vm.newClientInfo = [];
            var uid = vm.jobsetup.sector.id;
            angular.forEach(vm.clients, function (todo, key) {
                if (todo.sectorId === uid) {
                    vm.newClientInfo.push(todo);
                }
            });
        }

        function getServerJobs(forceRefresh) {
            return datacontext.resourcejob.getServerJobQueues(forceRefresh, vm.paging.currentPage, vm.paging.pageSize, vm.serverJobsSearch)
                .then(function (data) {
                    vm.jobNames = vm.serverJobs = vm.filteredServerJobs = data;
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

    }
})();
