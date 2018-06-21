(function () {
    'use strict';
    var controllerId = 'CardPartialIssuanceDetailInventIN';
    angular
        .module('app')
        .controller('CardPartialIssuanceDetailInventIN', CardPartialIssuanceDetailInventIN);

    CardPartialIssuanceDetailInventIN.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function CardPartialIssuanceDetailInventIN($location, $routeParams, $scope, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        
        vm.collectors = [];
        vm.job = undefined;
        vm.jobs = [];
        vm.jobTracker = undefined;
        vm.stateCheck = undefined;
        vm.goBack = goBack;
        vm.save = save;
        $scope.message = "";

        vm.issuanceLogs = [];
        vm.clientVault = [];

        activate();

        function activate() {
            //, getJobIssuanceLog(), getClientVaultReport()
            var promises = [getRequestedJob()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated JobDetails View'); });
        }

        function getRequestedJob() {
            var val = $routeParams.cardIssuanceId;
            return datacontext.inventjob.getCardIssuanceById(val)
                .then(function (data) {
                    vm.cardIssuance = data;
                    //console.log(vm.cardIssuance);
                    getProductVariant(vm.cardIssuance.jobId);
                    getJobs();
                }, function (error) {
                    logError('Unable to get JobTracker ' + val);
                });
        }

        function getProductVariant(jobId, forceRefresh) {
            return datacontext.resourcejob.getJobVariantByJobId(jobId, forceRefresh).then(function (data) {
                //console.log(data);
                if (data.length !== 0) {
                    vm.jobVariants = data[0];
                    //console.log(vm.jobVariants);
                    vm.productName = true;
                }
                return vm.jobVariants;
            });
        }

        function getJobs(forceRefresh) {
            return datacontext.resourcejob.getJobs(forceRefresh).then(function (data) {
                vm.jobs = data;
                getReceiverAccount(vm.cardIssuance.job.serviceType.name);
                return vm.jobs;
            });
        }

        function goBack() { $window.history.back(); }

        function save() {
            var val = $routeParams.cardIssuanceId;

            vm.newEntity = {
                id: val,
                jobId: vm.cardIssuance.jobId,
                totalQuantity: vm.cardIssuance.totalQuantity,
                totalQuantityIssued: vm.issuance.quantity,
                collectorId: vm.issuance.receiver.id,
            };

            createEntity(vm.newEntity);
        }

        function createEntity(entity) {
            var val = $routeParams.trackerId;
            var resourceUri = model.resourceUri.inventory + '/partial/cardissuance/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                vm.cardreceipt = {};
                $location.path('/in/partial-jobs');
            },
			 function (response) {
			     //console.log(response);
			     $scope.message = "Failed to save due to: "
                     + response.data.message;
			 });
        }



   
        function getClientVaultReport(forceRefresh) {
            var val = $routeParams.trackerId;
            //console.log(val);
            return datacontext.inventory.getClientVaultReportByTrackerId(val, forceRefresh).then(function (data) {
                vm.clientVault = data;

                if (vm.clientVault.length == 0) {
                    vm.createVault = true;
                }
                //console.log(vm.clientVault);
                return vm.clientVault;
            });
        }

        function getJobIssuanceLog() {
            var val = $routeParams.trackerId;
            return datacontext.inventjob.getCardIssuanceLogs(val)
                .then(function (data) {
                    vm.issuanceLogs = data;
                }, function (error) {
                    logError('Unable to get CardIssuanceLog ' + val);
                });
        }

        function getClientStockReport() {
            var val = $routeParams.trackerId;
            return datacontext.inventjob.getCardIssuanceLogs(val)
                .then(function (data) {
                    vm.issuanceLogs = data;
                }, function (error) {
                    logError('Unable to get CardIssuanceLog ' + val);
                });
        }

     

        // Navigation Request
        

        function getCardEngrCollector(forceRefresh) {
            return datacontext.inventaccount.getCardEngrStaffs(forceRefresh).then(function (data) {
                vm.collectors = data;
                return vm.collectors;
            });
        }

        function getProductionStaffCollector(forceRefresh) {
            return datacontext.inventaccount.getProductionStaffs(forceRefresh).then(function (data) {
                vm.collectors = data;
                return vm.collectors;
            });
        }

        function getReceiverAccount(entity) {
            if (entity === 'Perso Only') {
                getCardEngrCollector();
            } else if (entity === 'Printing Only') {
                getProductionStaffCollector();
            } else if (entity === 'Mailing Only') {
                getProductionStaffCollector();
            } else if (entity === 'Printing And Perso') {
                getCardEngrCollector();
            } else {
                getProductionStaffCollector();
            }

        }

    }


})();
