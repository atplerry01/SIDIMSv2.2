(function () {
    'use strict';
    var controllerId = 'PrintWasteIssuanceDetailInventIN';
    angular
        .module('app')
        .controller('PrintWasteIssuanceDetailInventIN', PrintWasteIssuanceDetailInventIN);

    PrintWasteIssuanceDetailInventIN.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function PrintWasteIssuanceDetailInventIN($location, $routeParams, $scope, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.issuance = {};
        vm.issuanceLogs = [];
        vm.collectors = [];
        vm.job = undefined;
        vm.jobs = [];
        vm.jobTracker = undefined;
        vm.stateCheck = undefined;
        vm.goBack = goBack;
        vm.save = save;
        $scope.message = "";

        activate();

        function activate() {
            var promises = [getRequestedJob(), getProductionStaffCollector()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated JobDetails View'); });
        }

        function getRequestedJob() {
            var val = $routeParams.wasteAnalysisId;
            //console.log(val);
            return datacontext.resourcejob.getPrintWasteAnalysisById(val)
                .then(function (data) {
                    vm.cardWaste = data;
                    //console.log(vm.cardWaste);
                    //console.log(vm.cardWaste.quantityBad);
                    vm.issuance.quantity = vm.cardWaste.quantityBad;
                    //getProductVariant(vm.jobTracker.jobId);
                    //getJobs();
                }, function (error) {
                    logError('Unable to get CardWaste ' + val);
                });
        }

        function getProductionStaffCollector(forceRefresh) {
            return datacontext.inventaccount.getProductionStaffs(forceRefresh).then(function (data) {
                vm.collectors = data;
                return vm.collectors;
            });
        }

        function goBack() { $window.history.back(); }

        function save() {
          
            //console.log(vm.cardWaste);

            vm.newEntity = {
                id: vm.cardWaste.id,
                jobTrackerId: vm.cardWaste.jobTrackerId,
                JobSplitPrintCEAnalysisId: vm.cardWaste.jobSplitPrintCEAnalysisId,
                QuantityBad: vm.cardWaste.quantityBad,
                WasteErrorSourceId: vm.cardWaste.wasteErrorSourceId,
                WasteByUnitId: vm.cardWaste.wasteByUnitId,
            };

            //console.log(vm.newEntity);
            createEntity(vm.newEntity);
        }

        function createEntity(entity) {
            var resourceUri = model.resourceUri.inventory + '/waste/printissuance/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                vm.cardreceipt = {};
                $location.path('/in/print-waste-jobs');
            },
			 function (response) {
			     //console.log(response);
			     $scope.message = "Failed to save due to: "
                     + response.data.message;
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
