(function () {
    'use strict';
    var controllerId = 'NonPersoJobSetupCO';
    angular
        .module('app')
        .controller('NonPersoJobSetupCO', NonPersoJobSetupCO);

    NonPersoJobSetupCO.$inject = ['$location', '$routeParams', '$scope', 'config', 'common', 'datacontext', 'model', 'resourceService'];

    function NonPersoJobSetupCO($location, $routeParams, $scope, config, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;
        //vm.gotoAddVariant = gotoAddVariant;

        //vm.serverJobs = [];
        vm.serverJob = undefined;
        vm.job = [];
        vm.goBack = goBack;
        vm.gotoJobDetails = gotoJobDetails;
        vm.updateClientList = updateClientList;

        //vm.gotoVariants = gotoVariants;
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
            vm.serviceTypes = lookups.serviceTypes;
            vm.remarks = lookups.remarks;
            vm.sectors = lookups.sectors;
            vm.sidCardTypes = lookups.sidCardTypes;
            vm.dictionaryClientNames = lookups.dictionaryClientNames;
            vm.dictionaryCardTypes = lookups.dictionaryCardTypes;
            vm.dictionaryServiceTypes = lookups.dictionaryServiceTypes;
        }

        function getRequestedJob() {
            var val = $routeParams.id;

            if (val) {
                return datacontext.resourcejob.getByNonPersoJobId(val)
                .then(function (data) {
                    vm.jobsetup = data;
                    console.log(vm.jobsetup);
                    return vm.jobsetup;
                }, function (error) {
                    logError('Unable to get variant ' + val);
                });
            }
        }

        function gotoJobDetails(entity) {
            console.log(entity);
            if (entity && entity.id) {
                $location.path('/co/job-setup/' + entity.id)
            }
        }

        function goBack() { $window.history.back(); }

        function saveJob() {
            var val = $routeParams.id;

            //console.log(vm.jobsetup);

            //if (document.getElementById('jobName').value == ""
            //     || document.getElementById('jobName').value == undefined) {
            //    alert("Please select a valid Job Name");
            //    return false;
            //}

            //console.log(vm.jobsetup.remarks);

            //var remarkValue;
            //if (vm.jobsetup.remarks === undefined) {
            //    remarkValue = '';
            //} else {
            //    remarkValue = vm.jobsetup.remarks.name;
            //}

            console.log(vm.jobsetup);

            if (vm.jobsetup.jobName !== null || vm.jobsetup.jobName !== undefined) {
                vm.newJob = {
                    id: vm.jobsetup.id,
                    jobName: vm.jobsetup.jobName + ' : ' + vm.jobsetup.sidProduct.sidClient.name,
                    jobNameId: vm.jobsetup.jobNameId,
                    sidSectorId: vm.jobsetup.sidProduct.sidClient.sectorId,
                    sidClientId: vm.jobsetup.sidProduct.sidClientId,
                    sidCardTypeId: vm.jobsetup.sidProduct.sidCardTypeId,
                    //remark: remarkValue,
                    ServiceTypeId: vm.jobsetup.serviceTypeId,
                    quantity: vm.jobsetup.quantity,

                    jobType: "NonPerso"
                };

                console.log(vm.newJob);
                updateEntity(vm.newJob);
            } else {
                console.log('error');
                vm.errorMessage = 'No Job Selected'
            }

        }

        function updateEntity(entity) {
            var resourceUri = model.resourceUri.co + '/job/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                vm.serverJob = {};
                vm.jobsetup = {};
                gotoJobStatus();
            },
			 function (response) {
			     console.log(response);
			     //gotoJobStatus();
			 });
        }

        function gotoJobStatus() {
            $location.path('/job-status');
        }

        function updateClientList(entity) {
            vm.newClientInfo = [];
            var uid = vm.jobsetup.sector.id;
            angular.forEach(vm.clients, function (todo, key) {
                if (todo.sectorId == uid) {
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
