(function () {
    'use strict';
    var controllerId = 'CardIssuancePartialDetailInventIN';
    angular
        .module('app')
        .controller('CardIssuancePartialDetailInventIN', CardIssuancePartialDetailInventIN);

    CardIssuancePartialDetailInventIN.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext'];

    function CardIssuancePartialDetailInventIN($location, $routeParams, $scope, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.collectors = [];
        vm.jobs = [];
        vm.jobTracker = undefined;
        vm.stateCheck = undefined;
        vm.goBack = goBack;
        vm.save = save;

        activate();

        //Todo: Get List of Engineer

        function activate() {
            var promises = [getJobs(), getRequestedJob(), getReceiverAccount()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated JobDetails View'); });
        }

        function getJobs(forceRefresh) {
            return datacontext.resourcejob.getJobs(forceRefresh).then(function (data) {
                vm.jobs = data;
                return vm.jobs;
            });
        }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            vm.jobStatus = lookups.jobStatus;

            angular.forEach(vm.jobStatus, function (todo, key) {
                if (todo.name == 'Not Required') {
                    vm.stateCheck = todo.name;
                }
            });

            ////console.log(todo);
        }

        function getRequestedJob() {
            var val = $routeParams.id;

            return datacontext.resourcejob.getJobById(val)
                .then(function (data) {
                    vm.job = data;
               
                    //Todo: check if working
                    getReceiverAccount(vm.job.serviceType.name);

                }, function (error) {
                    logError('Unable to get JobTracker ' + val);
                });
        }

        function gotoJobDetails(entity) {
            if (entity && entity.id) {
                $location.path('/co/job-setup/' + entity.id)
            }
        }

        function goBack() { $window.history.back(); }

        function getReceiverAccount(entity) {

            // Load the Collector
            if (entity === 'Perso Only') {
                getCardEngrCollector();
            } else if (entity === 'Printing Only') {
                // Load Printing
                //console.log('ok2');
            } else if (entity === 'Mailing Only') {
                // Loading Mail
                //console.log('ok3');
            } else if (entity === 'Printing And Perso') {
                // Loading Printing
                //console.log('ok4');
                getCardEngrCollector();
            }

        }

        function getCardEngrCollector(forceRefresh) {
            return datacontext.inventaccount.getCardEngrStaffs(forceRefresh).then(function (data) {
                vm.collectors = data;
                return vm.collectors;
            });
        }

        function save() {
            var val = $routeParams.id;
            // Issuance Type
            vm.newEntity = {
                jobId: val,
                totalQuantity: vm.cardrequest.chiptype.id,
                totalQuantityIssued: vm.cardrequest.quantity,
                sidLientId: vm.cardrequest.quantity,
            };



        }

    }


})();
