(function () {
    'use strict';
    var controllerId = 'CardIssuanceLogDetailInventIN';
    angular
        .module('app')
        .controller('CardIssuanceLogDetailInventIN', CardIssuanceLogDetailInventIN);

    CardIssuanceLogDetailInventIN.$inject = ['$location', '$routeParams', '$scope', '$window', 'common', 'datacontext'];

    function CardIssuanceLogDetailInventIN($location, $routeParams, $scope, $window, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.gotoPartialIssuance = gotoPartialIssuance;
        vm.cardissuances = [];
        vm.jobTracker = undefined;
        vm.stateCheck = undefined;
        vm.goBack = goBack;
        vm.save = save;

        activate();

        //Todo: Get List of Engineer

        function activate() {
            var promises = [getCardIssuanceLogs(), getInventoryUsers(), getCardIssuances(), getJobs()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated JobDetails View'); });
        }

        // Get CardIssuance

        function getCardIssuanceLogs(forceRefresh) {
            var val = $routeParams.id;
            return datacontext.inventjob.getCardIssuanceLogs(val, forceRefresh).then(function (data) {
                vm.cardissuancelogs = data;
                //console.log(vm.cardissuancelogs);
                return vm.cardissuancelogs;
            });
        }

        function getCardIssuances(forceRefresh) {
            return datacontext.inventjob.getCardIssuances(forceRefresh).then(function (data) {
                vm.cardissuances = data;
                //console.log(vm.cardissuances);
                return vm.cardissuances;
            });
        }

        function getJobs(forceRefresh) {
            return datacontext.inventjob.getJobs(forceRefresh).then(function (data) {
                vm.jobs = data;
                return vm.jobs;
            });
        }

        function getInventoryUsers(forceRefresh) {
            return datacontext.inventaccount.getInventoryUsers(forceRefresh).then(function (data) {
                vm.invusers = data;
                //console.log(vm.invusers);
                return vm.invusers;
            });
        }

        function gotoPartialIssuance() {
            $location.path('/in/partial-card-issuance/new');
        }

        ///

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
               
                    getReceiverAccount(vm.job.jobType.name);

                  
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



            // CardEngr
            //getCardEngrCollector();
            // Printing
            // Mailing

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
