(function () {
    'use strict';
    var controllerId = 'IncomingDeliveryIN';
    angular
        .module('app')
        .controller('IncomingDeliveryIN', IncomingDeliveryIN);

    IncomingDeliveryIN.$inject = ['$location', '$routeParams', 'common', 'datacontext', 'model', 'resourceService'];

    function IncomingDeliveryIN($location, $routeParams, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.gotoJobDetails = gotoJobDetails;
        vm.wasteReport = wasteReport;
        vm.jobs = [];
        vm.incomingJobs = [];

        activate();

        function activate() {
            
            var promises = [getIncomingJobs()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getIncomingJobs(forceRefresh) {
            var val = $routeParams.clientId;
            return datacontext.dispatchjob.getClientIncomingJobs(val, forceRefresh).then(function (data) {
                vm.incomingJobs = data;
                //console.log(vm.incomingJobs);
                return vm.incomingJobs;
            });
        }

        function gotoJobDetails(entity) {
            if (entity && entity.id) {
                $location.path('/in/dispatch/client-jobs/' + entity.id);
            }
        }

        function wasteReport(entity) {
            //console.log(entity);

            if (entity && entity.id) {
                $location.path('/in/dispatch/client-wastes/' + entity.id);
            }
        }

        function goBack() { $window.history.back(); }


        //function getJobTrackers(forceRefresh) {
        //    return datacontext.resourcejob.getJobTrackers(forceRefresh).then(function (data) {
        //        vm.jobTrackers = data;
        //        //console.log(vm.jobTrackers);
        //        return vm.jobTrackers;
        //    });
        //}

        //function getJobs(forceRefresh) {
        //    return datacontext.inventjob.getJobs(forceRefresh).then(function (data) {
        //        vm.jobs = data;
        //        return vm.jobs;
        //    });
        //}

      
        //function confirmReceipt(entity) {
            
        //    vm.newEntity = {
        //        id: entity.id,
        //        jobTrackerId: entity.jobTrackerId
        //    };

        //    //console.log(vm.newEntity);
        //    createEntity(vm.newEntity);
        //}
        
        //function createEntity(entity) {
        //    var resourceUri = model.resourceUri.inventory + '/carddeliveryconfirmation/create';
        //    resourceService.saveResource(resourceUri, entity).then(function (response) {
        //        //console.log(response);
        //            getIncomingJobs();
        //            // else Initialise
        //            //$location.path('/in/dispatch/incoming-jobs');
        //        },
        //        function (response) {
        //            //console.log(response);
        //        });
        //}



    }
})();
