(function () {
    'use strict';
    var controllerId = 'JobSetupCOSupv';
    angular
        .module('app')
        .controller('JobSetupCOSupv', JobSetupCOSupv);

    JobSetupCOSupv.$inject = ['$location', '$routeParams', '$scope', 'config', 'common', 'datacontext', 'model', 'resourceService'];

    function JobSetupCOSupv($location, $routeParams, $scope, config, common, datacontext, model, resourceService) {
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
            vm.priority = lookups.priority;
            vm.sidCardTypes = lookups.sidCardTypes;
        }

        function getRequestedJob() {
            var val = $routeParams.id;
            if (val) {
                return datacontext.resourcejob.getJobById(val)
                .then(function (data) {
                    vm.job = data;
                    clientPreLoad(vm.job.sidSectorId);
                    return vm.job;
                }, function (error) {
                    logError('Unable to get variant ' + val);
                });
            }
        }

        function gotoJobDetails(entity) {
            if (entity && entity.id) {
                $location.path('/co/job-setup/' + entity.id)
            }
        }

        function goBack() { $window.history.back(); }

        function saveJob() {
            var val = $routeParams.id;
      
            if (document.getElementById('jobName').value == ""
                 || document.getElementById('jobName').value == undefined) {
                alert("Please select a valid Job Name");
                return false;
            }

            var remarkValue;
            if (vm.job.remark === undefined) {
                remarkValue = '';
            } else {
                remarkValue = vm.job.remark2.name;
            }

            if (vm.job.jobName !== null || vm.job.jobName !== undefined) {
                vm.newJob = {
                    jobId: vm.job.id,
                    jobName: vm.job.jobName,
                    sidSectorId: vm.job.sidSector.id,
                    sidClientId: vm.job.sidClient.id,
                    sidCardTypeId: vm.job.sidCardType.id,
                    remark: remarkValue,
                    ServiceTypeId: vm.job.serviceType.id,
                    quantity: vm.job.quantity
                };

                updateEntity(vm.newJob);
            } else {
                //console.log('error');
                vm.errorMessage = 'No Job Selected'
            }
            
        }

        function updateEntity(entity) {
            var resourceUri = model.resourceUri.supervisor + '/updatejobandtracker/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                $location.path('/sup/co/incoming-jobs')
            },
			 function (response) {
			     var errors = [];
			     for (var key in response.data.modelState) {
			         for (var i = 0; i < response.data.modelState[key].length; i++) {
			             errors.push(response.data.modelState[key][i]);
			         }
			     }
			     $scope.message = "Failed to save resource due to:" + errors.join(' ');
			 });
        }

        function createEntity(entity) {
            var resourceUri = model.resourceUri.co + '/job/update';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                vm.serverJob = {};
                vm.job = {};

                gotoJobStatus();
            },
			 function (response) {
			     //console.log(response);
			     var errors = [];
			     for (var key in response.data.modelState) {
			         for (var i = 0; i < response.data.modelState[key].length; i++) {
			             errors.push(response.data.modelState[key][i]);
			         }
			     }
			     $scope.message = "Failed to save resource due to:" + errors.join(' ');

                 //Todo: Please remove the method
			     gotoJobStatus();
			 });
        }

        function gotoJobStatus() {
            $location.path('/job-status');
        }

        function clientPreLoad() {
            vm.newClientInfo = [];
            var uid = vm.job.sidSector.id;
            angular.forEach(vm.clients, function (todo, key) {
                if (todo.sectorId == uid) {
                    vm.newClientInfo.push(todo);
                }
            });
        }

        function updateClientList(entity) {
            vm.newClientInfo = [];
            var uid = vm.job.sidSector.id;
            angular.forEach(vm.clients, function (todo, key) {
                if (todo.sectorId == uid) {
                    vm.newClientInfo.push(todo);
                }
            });

        }

        //function getServerJobs(forceRefresh) {
        //    return datacontext.resourcejob.getServerJobQueues(forceRefresh, vm.paging.currentPage, vm.paging.pageSize, vm.serverJobsSearch)
        //        .then(function (data) {
        //            vm.jobNames = vm.serverJobs = vm.filteredServerJobs = data;
        //            if (!vm.serverJobCount || forceRefresh) {
        //                getServerJobCount();
        //            }
        //            getServerJobFilteredCount();
        //            return data;
        //        });
        //}

        //function getServerJobCount() {
        //    return datacontext.resourcejob.getServerJobCount().then(function (data) {
        //        return vm.serverJobCount = data;
        //    });
        //}

        //function getServerJobFilteredCount() {
        //    vm.serverJobFilteredCount = datacontext.resourcejob.getServerJobFilteredCount(vm.serverJobsSearch);
        //}

        //function search($event) {
        //    if ($event.keyCode === keyCodes.esc) { vm.serverJobsSearch = ''; }
        //    getServerJobs();
        //}

        //function pageChanged(page) {
        //    if (!page) { return; }
        //    vm.paging.currentPage = page;
        //    getServerJobs();
        //}




    }
})();
