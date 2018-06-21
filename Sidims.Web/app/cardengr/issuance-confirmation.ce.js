(function () {
    'use strict';
    var controllerId = 'IssuanceConfirmationCE';
    angular
        .module('app')
        .controller('IssuanceConfirmationCE', IssuanceConfirmationCE);

    IssuanceConfirmationCE.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function IssuanceConfirmationCE($location, $routeParams, $scope, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);


        vm.jobBatchTracker = [];
        vm.issuanceLogs = [];
        vm.allIssuanceLogs = [];
        vm.cardlogs = [];
        vm.cardlog = undefined;

        vm.save = save;

        activate();

        function activate() {
            var promises = [
                getRequestedBatchTracker(), getRequestedIssuanceDetail(),
                getJobs(), getProductionUsers()
            ];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getRequestedBatchTracker() {
            var val = $routeParams.batchId;
            return datacontext.resourcejob.getJobBatchTrackerById(val)
               .then(function (data) {
                   vm.jobBatchTracker = data;
               }, function (error) {
                   logError('Unable to get JobBatchTracker ' + val);
               });
        }

        function getRequestedIssuanceDetail() {
            var val = $routeParams.id;
            return datacontext.resourcejob.getCardIssuanceById(val)
               .then(function (data) {
                   vm.cardIssuance = data;
                   getCardIssuanceLogs(vm.cardIssuance.jobTrackerId);
               }, function (error) {
                   logError('Unable to get CardIssuance ' + val);
               });
        }

        function getCardIssuanceLogs(jobTrackerId, forceRefresh) {
            return datacontext.inventjob.getCardIssuanceLogByTrackerId(jobTrackerId, forceRefresh).then(function (data) {
                vm.cardlogs = data;
                vm.cardlog = vm.cardlogs[0];
               
                return vm.jobTrackers;
            });
        }

        function save() {
            var val = $routeParams.id;
            var batchId = $routeParams.batchId;

            vm.newEntity = {
                jobBatchTrackerId: batchId,
                cardIssuanceLogId: vm.cardlog.id,
            };

            createEntity(vm.newEntity);
        }

        function createEntity(entity) {
            var batchId = $routeParams.batchId;
            var resourceUri = model.resourceUri.ce + '/CardIssuanceConfirmation/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                //Todo: If new Job // run first Card
                $location.path('/ce/first-card/' + batchId);
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

        function getJobs(forceRefresh) {
            return datacontext.inventjob.getJobs(forceRefresh).then(function (data) {
                vm.jobs = data;
                return vm.jobs;
            });
        }

        function getProductionUsers(forceRefresh) {
            return datacontext.inventaccount.getProductionStaffs(forceRefresh).then(function (data) {
                vm.users = data;
                return vm.users;
            });
        }

        function goBack() { $window.history.back(); }

    }
})();
