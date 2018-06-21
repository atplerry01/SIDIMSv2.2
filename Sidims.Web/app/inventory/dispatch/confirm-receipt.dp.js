(function () {
    'use strict';
    var controllerId = 'ConfirmReceiptDPIN';
    angular
        .module('app')
        .controller('ConfirmReceiptDPIN', ConfirmReceiptDPIN);

    ConfirmReceiptDPIN.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function ConfirmReceiptDPIN($location, $routeParams, $scope, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.jobBatchTrackers = undefined;
        vm.gotoJobDetails = gotoJobDetails;
        vm.jobs = [];
        vm.incomingJobs = [];
        vm.save = save;

        activate();

        function activate() {
            var promises = [getRequestedTracker(), getJobs()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getRequestedTracker() {
            var val = $routeParams.id;
            return datacontext.dispatchjob.getJobBatchTrackerById(val)
               .then(function (data) {
                   vm.jobBatchTrackers = data;
                   //console.log(vm.jobBatchTrackers);
               }, function (error) {
                   logError('Unable to get JobBatchTracker ' + val);
               });
        }

        function save() {
            //console.log(vm.jobBatchTrackers);
            
            var val = $routeParams.id;
            var batchId = $routeParams.batchId;

            vm.newEntity = {
                jobBatchTrackerId: vm.jobBatchTrackers.id,
                cardIssuanceLogId: vm.jobBatchTrackers.cardIssuanceLogId,
                jobId: vm.jobBatchTrackers.jobId
            };

            //console.log(vm.newEntity);
            createEntity(vm.newEntity);
        }

        function createEntity(entity) {
            var batchId = $routeParams.batchId;
            var resourceUri = model.resourceUri.inventory + '/DispatchJobReceipt/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                // else Initialise
                $location.path('/in/dispatch/incoming-jobs');
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
			 });
        }

        ///
        function getJobs(forceRefresh) {
            return datacontext.inventjob.getJobs(forceRefresh).then(function (data) {
                vm.jobs = data;
                return vm.jobs;
            });
        }

        function gotoJobDetails(entity) {
            if (entity && entity.id) {
                $location.path('/in/dispatch/receive-job/' + entity.job.id)
            }
        }

        function goBack() { $window.history.back(); }

    
    }
})();
