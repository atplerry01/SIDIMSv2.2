(function () {
    'use strict';
    var controllerId = 'JobDeliveryMA';
    angular
        .module('app')
        .controller('JobDeliveryMA', JobDeliveryMA);

    JobDeliveryMA.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function JobDeliveryMA($location, $routeParams, $scope, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.pendingjobs = [];
        vm.gotoJobDetails = gotoJobDetails;

        activate();

        function activate() {
            var promises = [getPendingDeliveryJob(), getJobs()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getPendingDeliveryJob(forceRefresh) {
            return datacontext.mailingjob.getMAPendingDeliverys(forceRefresh).then(function (data) {
                vm.pendingjobs = data;
                //console.log(vm.pendingjobs);
                return vm.pendingjobs;
            });

        }

        function getJobs(forceRefresh) {
            return datacontext.resourcejob.getJobs(forceRefresh).then(function (data) {
                vm.jobs = data;
                //console.log(vm.jobs);
                return vm.jobs;
            });
        }

        function gotoJobDetails(entity) {
            if (entity && entity.id) {
                $location.path('/ma/job-delivery/' + entity.id);
            }
        }

        function goBack() { $window.history.back(); }

    }
})();
