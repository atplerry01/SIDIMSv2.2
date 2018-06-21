(function () {
    'use strict';
    var controllerId = 'JobDetailCS';
    angular
        .module('app')
        .controller('JobDetailCS', JobDetailCS);

    JobDetailCS.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function JobDetailCS($location, $routeParams, $scope, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.deliveryNoteLogs = [];
        vm.save = save;

        activate();

        //Todo: Get List of Engineer

        function activate() {
            var promises = [
                getRequestedDeliveryNote(), getDeliveryNoteLog(), getJobTrackers(), getJobs()
            ];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated JobDetails View'); });
        }

        function getRequestedDeliveryNote(forceRefresh) {
            var val = $routeParams.deliveyNoteId;
            
            return datacontext.resourcejob.getDeliveryNoteId(val, forceRefresh)
                .then(function (data) {
                    vm.deliveryNote = data;
                    
                    getDispatchDelivery(vm.deliveryNote.sidClientId);

                    //console.log(vm.deliveryNote);
                }, function (error) {
                    logError('Unable to get deliveryNote ' + val);
                });
        }


        // get all delivery log
        function getDeliveryNoteLog(forceRefresh) {
            var val = $routeParams.deliveyNoteId;

            return datacontext.dispatchjob.getDeliveryNoteLogByNoteId(val, forceRefresh).then(function (data) {
                vm.deliveryNoteLogs = data;
                //console.log(vm.deliveryNoteLogs);
                return vm.deliveryNoteLogs;
            });
        }


        function getJobTrackers(forceRefresh) {
            return datacontext.resourcejob.getJobTrackers(forceRefresh)
                .then(function (data) {
                    vm.jobTrackers = data;
                    return vm.jobTrackers;
                });
        }

        function getJobs(forceRefresh) {
            return datacontext.inventjob.getJobs(forceRefresh).then(function (data) {
                vm.jobs = data;
                return vm.jobs;
            });
        }

        function getDispatchDelivery(clientId, forceRefresh) {
            //console.log(clientId);

            return datacontext.dispatchjob.getDispatchDeliveryGenerated(clientId, forceRefresh).then(function (data) {
                vm.dispatchDelivery = data;
                //console.log(vm.dispatchDelivery);
                return vm.dispatchDelivery;
            });
        }

        function save() {
            var val = $routeParams.deliveyNoteId;

            vm.newEntity = {
                deliveryNoteId: val,
            };

            createEntity(vm.newEntity);
        }

        function createEntity(entity) {
            var resourceUri = model.resourceUri.cs + '/deliveryNote/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                $location.path('/cs/incoming-jobs');
            },
			 function (response) {
			     //console.log(response);
			 });
        }


    }


})();
