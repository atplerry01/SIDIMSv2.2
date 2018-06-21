(function () {
    'use strict';
    var controllerId = 'NonPersoJobSetupCO';
    angular
        .module('app')
        .controller('NonPersoJobSetupCO', NonPersoJobSetupCO);

    NonPersoJobSetupCO.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function NonPersoJobSetupCO($location, $routeParams, $scope, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
      
        vm.serverJobs = [];
        vm.serverJob = undefined;
        vm.job = [];
        vm.goBack = goBack;
        vm.gotoJobDetails = gotoJobDetails;
        vm.updateClientList = updateClientList;

        //vm.gotoVariants = gotoVariants;
        vm.nonPersoJob = undefined;
        vm.save = saveJob;
        vm.clients = [];
        vm.newClientInfo = [];
        vm.jobTypes = [];
        vm.remarks = [];
        vm.sectors = [];
        vm.priority = [];
        vm.sidVariants = [];
        vm.sidCardTypes = [];

        vm.jobNames = [];

        activate();

        function activate() {
            //initLookups();
            var promises = [getRequestedServerJob(), getServerJobs()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Variants View'); });
        }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            //vm.clients = lookups.clients;
            //vm.serviceTypes = lookups.serviceTypes;
            vm.remarks = lookups.remarks;
            //vm.sectors = lookups.sectors;
            //vm.priority = lookups.priority;
            //vm.sidCardTypes = lookups.sidCardTypes;
        }

        function getRequestedServerJob() {
            var val = $routeParams.id;
            //Todo
            if (val) {
                return datacontext.resourcejob.getByNonPersoJobId(val)
                .then(function (data) {
                    vm.nonPersoJob = data;
                    //console.log(vm.nonPersoJob);
                    initLookups();
                    return vm.nonPersoJob;
                }, function (error) {
                    logError('Unable to get variant ' + val);
                });
            }
        }

        function getServerJobs(forceRefresh) {
            return datacontext.resourcejob.getNonPersoJobs(forceRefresh).then(function (data) {
                vm.jobNames = data;
                return vm.jobNames;
            });
        }

        function gotoJobDetails(entity) {
            if (entity && entity.id) {
                $location.path('/co/job-setup/' + entity.id)
            }
        }

        function goBack() { $window.history.back(); }

        function saveJob() {
            var val = $routeParams.id;

            vm.newJob = {
                id: vm.nonPersoJob.id,
                jobName: vm.nonPersoJob.jobName,
                sidSectorId: vm.nonPersoJob.sidProduct.sidClient.sector.id, //vm.job.sector.id,
                sidClientId: vm.nonPersoJob.sidProduct.sidClient.id, //vm.job.client.id,
                sidCardTypeId: vm.nonPersoJob.sidProduct.sidCardType.id, //vm.job.cardType.id,
                remarkId: vm.selectedrRemark.id, //vm.job.remark.id,
                ServiceTypeId: vm.nonPersoJob.serviceType.id, //vm.job.serviceType.id,
                quantity: vm.nonPersoJob.quantity, //vm.job.quantity,
                jobType: 'NonPerso'
            };

            //console.log(vm.newJob);
            createEntity(vm.newJob);
        }

        function createEntity(entity) {
            var resourceUri = model.resourceUri.co + '/job/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                vm.serverJob = {};
                vm.job = {};

                gotoJobStatus();
            },
			 function (response) {
			     var errors = [];
			     for (var key in response.data.modelState) {
			         for (var i = 0; i < response.data.modelState[key].length; i++) {
			             errors.push(response.data.modelState[key][i]);
			         }
			     }
			     $scope.message = "Failed to save resource due to:" + errors.join(' ');

			     //console.log(response);
                 //Todo: Please remove the method
			     //gotoJobStatus();
			 });
        }

        function gotoJobStatus() {
            $location.path('/job-status');
        }

        function updateClientList(entity) {
            vm.newClientInfo = [];
            var uid = vm.job.sector.id;
            angular.forEach(vm.clients, function (todo, key) {
                if (todo.sectorId == uid) {
                    vm.newClientInfo.push(todo);
                }
            });

        }

    }
})();
