(function () {
    'use strict';
    var controllerId = 'JobRunPrintQC';
    angular
        .module('app')
        .controller('JobRunPrintQC', JobRunPrintQC);

    JobRunPrintQC.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function JobRunPrintQC($location, $routeParams, $scope, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.ceJobSplit = undefined;
        vm.jobSplitCEAnalysis = [];
        vm.jobSplitQCAnalysis = [];
        vm.cardissuancelogs = [];
        vm.job = [];
        vm.jobSplits = [];
        vm.save = save;
        vm.updateJobSplit = updateJobSplit;
        vm.saveDeliverable = saveDeliverable;
        vm.defaultSave = defaultSave;
        vm.confirmCEDelivery = confirmCEDelivery;
        //vm.refreshDeliveryLog = refreshDeliveryLog;

        vm.displayJobSplitDetails = displayJobSplitDetails;

        vm.jobSplitDetail = false;
        vm.carddeliverylogs = [];
        vm.ceCarddeliverylogs = [];

        vm.deleteDelivery = deleteDelivery;

        activate();

        function activate() {
            var promises = [getRequestedJob(), getCardDeliveryLogs(), getProductionUsers()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getRequestedJob() {
            var val = $routeParams.trackerId;
            return datacontext.resourcejob.getJobTrackerById(val)
                .then(function (data) {
                    vm.jobTracker = data;
                    getJobSplits(vm.jobTracker.id);
                    getPrintJobSplitAnalysis(vm.jobTracker.id);
                    //getQCJobSplitAnalysis(vm.jobTracker.id);
                    getCardIssuanceLogs(vm.jobTracker.id);
                    getJobs(vm.jobTracker.jobId);
                }, function (error) {
                    logError('Unable to get JobTracker ' + val);
                });
        }


        function getJobSplits(entityId) {
            return datacontext.resourcejob.getJobSplitByJobTrackerId(entityId)
                .then(function (data) {
                    vm.jobSplits = data;
                }, function (error) {
                    logError('Unable to get JobSplit ' + entityId);
                });
        }


        function getPrintJobSplitAnalysis(entityId) {
            return datacontext.resourcejob.geJobSplitAnalysisByTrackerId(entityId)
                .then(function (data) {
                    vm.jobSplitCEAnalysis = data;
                    vm.getRangeTotal = getTotal();
                    vm.getQuantityGood = getTotalGood();
                    vm.getQuantityBad = getTotalBad();
                    vm.getQuantityHeld = getTotalHeld();

                }, function (error) {
                    logError('Unable to get JobSplit ' + entityId);
                });
        }

        //function getQCJobSplitAnalysis(entityId) {
        //    return datacontext.resourcejob.getJobSplitQCAnalysisByJobTrackerId(entityId)
        //        .then(function (data) {
        //            vm.jobSplitQCAnalysis = data;
        //        }, function (error) {
        //            logError('Unable to get JobSplit ' + entityId);
        //        });
        //}

        function getCardDeliveryLogs(forceRefresh) {
            var val = $routeParams.trackerId;
            return datacontext.resourcejob.getQCCardDeliveryLogByTrackerId(val, forceRefresh).then(function (data) {
                vm.carddeliverylogs = data;
                return vm.carddeliverylogs;
            });
        }


        // get CE Deliverables
        function getCECardDeliverables(forceRefresh) {
            var val = $routeParams.trackerId;
            return datacontext.resourcejob.getCECardDeliveryLogByTrackerId(val, forceRefresh).then(function (data) {
                vm.ceCarddeliverylogs = data;
                return vm.ceCarddeliverylogs;
            });
        }

        function getCardIssuanceLogs(entityId, forceRefresh) {
            return datacontext.inventjob.getCardIssuanceLogByTrackerId(entityId).then(function (data) {
                vm.cardissuancelogs = data;
                return vm.cardissuancelogs;
            });
        }

        function getJobs(entityId) {
            return datacontext.resourcejob.getJobById(entityId)
                .then(function (data) {
                    vm.jobs = data;
                }, function (error) {
                    logError('Unable to get Job ' + val);
                });
        }

        function displayJobSplitDetails(entity) {
            vm.jobSplitDetail = true;
            getRequestedJobSplitPrintAnalysisJob(entity.id);
        }

        function getRequestedJobSplitPrintAnalysisJob(entityId) {
            return datacontext.resourcejob.getJobSplitPrintCEAnalysisById(entityId)
                .then(function (data) {
                    vm.ceJobSplit = data;
                }, function (error) {
                    logError('Unable to get jobSplitCEAnalysis ' + val);
                });
        }

        function updateJobSplit() {
            var newEntity = {
                id: vm.ceJobSplit.id,
                jobSplitId: vm.ceJobSplit.jobSplitId,
                quantityGood: (vm.ceJobSplit.quantityGood) - (vm.ceJobSplit.quantityHeld - vm.ceJobSplit.quantityBad),
                quantityHeld: vm.ceJobSplit.newQuantityHeld,
                quantityBad: vm.ceJobSplit.newQuantityBad,
                createdById: vm.ceJobSplit.createdById,
                createdOn: vm.ceJobSplit.createdOn
            };

            updateJobSplitEntity(newEntity);
        }

        function updateJobSplitEntity(entity) {
            var resourceUri = model.resourceUri.qac + '/jobslit-printqc-analysis/update';
            resourceService.updateResource(resourceUri, entity).then(function (response) {
                //getQCJobSplitAnalysis(vm.jobTracker.id);
                getRequestedJob();
            },
			 function (response) {
			     $scope.message = "Failed to save resource due to:";
			 });
        }

        function goBack() { $window.history.back(); }

        function save() {
            var val = $routeParams.trackerId;

            vm.newEntity = {
                jobTrackerId: val,
                startFrom: 0, // Todo
                endPoint: 0,
            };

            createEntity(vm.newEntity);
        }

        function createEntity(entity) {

            var resourceUri = model.resourceUri.qac + '/jobrun/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                $location.path('/qc/incoming-persos');
            },
			 function (response) {
			     $scope.message = "Failed to save resource due to:";
			 });
        }

        function defaultSave() {
            var entity = {
                jobTrackerId: $routeParams.trackerId,
                rangeFrom: 1,
                rangeTo: vm.cardIssuance.totalQuantityIssued
            };

            deliveryCreateEntity(entity);
            $location.path('/qc/incoming-persos')
        }

        function saveDeliverable() {
            var entity = {
                jobTrackerId: $routeParams.trackerId,
                rangeFrom: vm.del.rangeFrom,
                rangeTo: vm.del.rangeTo,
                description: vm.del.description
            };

            var rangeVal = ((vm.del.rangeFrom - vm.del.rangeTo) + 1);
            var newQty = (rangeVal + vm.getRangeTotal + vm.cardIssuance.totalHeld);

            //Todo: plus heldcard
            if (newQty > vm.cardIssuance.totalQuantityIssued) {
                //console.log('Quantity Surpass');
            } else {
                //console.log('Ok');
            }

            deliveryCreateEntity(entity);
        }

        function deliveryCreateEntity(entity) {
            var resourceUri = model.resourceUri.qac + '/carddeliverylog/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                getCardDeliveryLogs();
                vm.del = {};
            },
                function (response) {
                    
                });
        }


        function confirmCEDelivery(entity) {
            if (entity && entity.id) {
                var newEntity = {
                    id: entity.id
                };

                updateResourceEntity(newEntity);
            }
        }

        function updateResourceEntity(entity) {
            var resourceUri = model.resourceUri.qac + '/carddeliverylogconfirm/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                getCECardDeliverables();
                //getCardDeliveryLogs();
            },
                function (response) {
                    //console.log(response);
                });
        }

        function getProductionUsers(forceRefresh) {
            return datacontext.inventaccount.getProductionStaffs(forceRefresh).then(function (data) {
                vm.users = data;
                return vm.users;
            });
        }


        function deleteDelivery(entity) {
            if (entity && entity.id) {
                var newEntity = {
                    id: entity.id,
                    jobTrackerId: $routeParams.trackerId
                };
                deleteDeliveryEntity(newEntity);
            }
        }

        function deleteDeliveryEntity(entity) {
            var resourceUri = model.resourceUri.qac + '/carddeliverylog/delete';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                getCardDeliveryLogs();
            },
                function (response) {
                    //console.log(response);
                });
        }

        function getTotal(forceRefresh) {
            var total = 0;
            for (var i = 0; i < vm.jobSplitCEAnalysis.length; i++) {
                var unitEntity = vm.jobSplitCEAnalysis[i];
                total += ((unitEntity.jobSplit.rangeTo - unitEntity.jobSplit.rangeFrom) + 1); //(product.price * product.quantity);
            }
            return total;
        }

        function getTotalGood(forceRefresh) {
            var total = 0;
            for (var i = 0; i < vm.jobSplitCEAnalysis.length; i++) {
                var unitEntity = vm.jobSplitCEAnalysis[i];
                total += unitEntity.quantityGood;
            }
            return total;
        }

        function getTotalBad(forceRefresh) {
            var total = 0;
            for (var i = 0; i < vm.jobSplitCEAnalysis.length; i++) {
                var unitEntity = vm.jobSplitCEAnalysis[i];
                total += unitEntity.quantityBad;
            }
            return total;
        }

        function getTotalHeld(forceRefresh) {
            var total = 0;
            for (var i = 0; i < vm.jobSplitCEAnalysis.length; i++) {
                var unitEntity = vm.jobSplitCEAnalysis[i];
                total += unitEntity.quantityHeld;
            }
            return total;
        }

        $scope.IsVisible = false;
        $scope.IsRangeVisible = false;

        $scope.ShowHide = function () {
            $scope.IsVisible = $scope.ShowPassport;
        }

        $scope.ShowHideRange = function () {
            $scope.IsRangeVisible = $scope.ShowPassportRange;
        }

    }
})();
