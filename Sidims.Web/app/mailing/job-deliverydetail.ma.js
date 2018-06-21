(function () {
    'use strict';
    var controllerId = 'JobDeliveryDetailMA';
    angular
        .module('app')
        .controller('JobDeliveryDetailMA', JobDeliveryDetailMA);

    JobDeliveryDetailMA.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function JobDeliveryDetailMA($location, $routeParams, $scope, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.del = {};
        vm.departments = [];
        vm.newMailingSplits = [];
        vm.carddeliverylogs = [];
        vm.saveDeliverable = saveDeliverable;
        vm.confirmCEDelivery = confirmCEDelivery;
        vm.refreshQCDeliveryLog = refreshQCDeliveryLog;
        vm.deleteDelivery = deleteDelivery;

        vm.errorMessage = '';
        vm.clearErrorMessage = clearErrorMessage;

        activate();

        function activate() {
            initLookups();
            var promises = [getRequestedJob(), getDepartmentList(), getProductionUsers()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function clearErrorMessage() {
            vm.errorMessage = '';
        }

        function refreshQCDeliveryLog() {
            getCECardDeliverables(vm.jobTracker.id);
        }


        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            vm.department = lookups.departments;
        }

        function getDepartmentList() {
            angular.forEach(vm.department, function (todo, key) {
                if (todo.name === 'Mailing') {
                    vm.departments.push(todo);
                }
            });
        }

        function getRequestedJob() {
            var val = $routeParams.trackerId;
            return datacontext.resourcejob.getJobTrackerById(val)
                .then(function (data) {
                    vm.jobTracker = data;
                    //console.log(vm.jobTracker);

                    getCEJobSplitAnalysis(vm.jobTracker.id);
                    getCardDeliveryLogs(vm.jobTracker.id);
                    getJobSplits(vm.jobTracker.id);
                    getCECardDeliverables();
                    getCardIssuanceLogByTrackerId(vm.jobTracker.id);
                    //getCardIssuance(vm.jobTracker.id);
                    getJobs(vm.jobTracker.jobId);
                }, function (error) {
                    logError('Unable to get JobTracker ' + val);
                });
        }

        function getCardIssuanceLogByTrackerId(entityId, forceRefresh) {
            return datacontext.inventjob.getCardIssuanceLogByTrackerId(entityId, forceRefresh).then(function (data) {
                vm.cardIssuanceLog = data[0];
                //console.log(vm.cardIssuanceLog);
                return vm.cardIssuanceLog;
            });
        }

        function getCardDeliveryLogs(trackerId, forceRefresh) {
            return datacontext.resourcejob.getMACardDeliveryLogByTrackerId(trackerId, forceRefresh).then(function (data) {
                vm.carddeliverylogs = data;

                vm.getRangeTotal = getTotal();
                //vm.getQuantityGood = getTotalGood();
                vm.getQuantityBad = getTotalBad();
                vm.getQuantityHeld = getTotalHeld();

                return vm.carddeliverylogs;
            });
        }

        function getTotal() {
            var total = 0;
            for (var i = 0; i < vm.carddeliverylogs.length; i++) {
                var unitEntity = vm.carddeliverylogs[i];
                total += ((unitEntity.rangeTo - unitEntity.rangeFrom) + 1);
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


        function getJobSplits(entityId) {
            return datacontext.resourcejob.getJobSplitByJobTrackerId(entityId)
                .then(function (data) {
                    vm.jobSplits = data;
                    getMailingSplits(vm.jobSplits, entityId);
                }, function (error) {
                    logError('Unable to get JobSplit ' + entityId);
                });
        }

        function getMailingSplits(entity, trackerId) {
            angular.forEach(entity, function (todo, key) {
                if (todo.departmentId === vm.departments[0].id && todo.jobTrackerId === trackerId) {
                    vm.newMailingSplits.push(todo);
                }
            });
        }

        function getCEJobSplitAnalysis(entityId) {
            return datacontext.resourcejob.getIncomingCESplitAnalysisByJobTrackerId(entityId)
                .then(function (data) {
                    vm.jobSplitCEAnalysis = data;
                }, function (error) {
                    logError('Unable to get JobSplit ' + entityId);
                });
        }

        function getCECardDeliverables(forceRefresh) {
            var val = $routeParams.trackerId;
            return datacontext.resourcejob.getQCCardDeliveryLogByTrackerId(val, forceRefresh).then(function (data) {
                vm.qcCarddeliverylogs = data;
                return vm.qcCarddeliverylogs;
            });
        }

        function saveDeliverable() {
            var entity = {
                jobTrackerId: $routeParams.trackerId,
                rangeFrom: vm.del.rangeFrom,
                rangeTo: vm.del.rangeTo,
                boxQty: vm.del.boxQty
            };

            var rangeVal = ((vm.del.rangeTo - vm.del.rangeFrom) + 1);
            var previousDelivery = getTotal();
            var totalDeliveryLog = (previousDelivery + rangeVal);

            if (totalDeliveryLog > vm.cardIssuanceLog.quantityIssued) {
                //console.log('Quantity Surpass');
            } else {
                deliveryCreateEntity(entity);
            }

        }

        function deliveryCreateEntity(entity) {
            var resourceUri = model.resourceUri.ma + '/carddeliverylog/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                getCardDeliveryLogs(vm.jobTracker.id);
                vm.del = {};
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
            var resourceUri = model.resourceUri.ma + '/carddeliverylog/delete';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                getCardDeliveryLogs(vm.jobTracker.id);
            },
                function (response) {
                    //console.log(response);
                });
        }



        function confirmCEDelivery(entity) {
            if (entity && entity.id) {
                var newEntity = {
                    id: entity.id
                };

                refreshQCDeliveryLog();
                updateResourceEntity(newEntity);
            }
        }

        function updateResourceEntity(entity) {
            var resourceUri = model.resourceUri.ma + '/carddeliverylogconfirm/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                getCardDeliveryLogs(vm.jobTracker.id);
            },
                function (response) {
                    //
                });
        }

        function getJobs(entityId) {
            return datacontext.resourcejob.getJobById(entityId)
                .then(function (data) {
                    vm.jobs = data;
                    fillRangeBox(vm.jobs);
                }, function (error) {
                    logError('Unable to get Job ' + val);
                });
        }

        function fillRangeBox(entity) {
            vm.del.rangeFrom = 1;
            vm.del.rangeTo = entity.quantity;
            vm.del.boxQty = 1;
        }

        function getProductionUsers(forceRefresh) {
            return datacontext.inventaccount.getProductionStaffs(forceRefresh).then(function (data) {
                vm.users = data;
                return vm.users;
            });
        }

        function save() {

            vm.newEntity = {
                jobId: vm.jobTracker.jobId
            };

            createEntity(vm.newEntity);
        }

        function createEntity(entity) {
            var val = $routeParams.id;
            var resourceUri = model.resourceUri.ce + '/resumenewjob/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                //vm.cardreceipt = {};
                $location.path('/ce/resumable/new-perso');
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

        function goBack() { $window.history.back(); }

        function displayJobSplitDetails(entity) {
            vm.jobSplitDetail = true;
            getRequestedJobSplitCEAnalysisJob(entity.id);
        }

        function getRequestedJobSplitCEAnalysisJob(entityId) {
            return datacontext.resourcejob.getJobSplitCEAnalysisById(entityId)
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
                quantityGood: vm.ceJobSplit.quantityGood,
                quantityHeld: vm.ceJobSplit.quantityHeld,
                quantityBad: vm.ceJobSplit.quantityBad,
                createdById: vm.ceJobSplit.createdById,
                createdOn: vm.ceJobSplit.createdOn
            };

            updateJobSplitEntity(newEntity);
        }

        function updateJobSplitEntity(entity) {
            var resourceUri = model.resourceUri.ce + '/jobslit-ce-analysis/update';
            resourceService.updateResource(resourceUri, entity).then(function (response) {
                getCEJobSplitAnalysis(vm.jobTracker.id);
            },
			 function (response) {
			     $scope.message = "Failed to save resource due to:";
			 });
        }

        function getCardIssuance(entityId, forceRefresh) {
            return datacontext.resourcejob.getCardIssuanceByTrackerId(entityId, forceRefresh).then(function (data) {
                vm.cardIssuance = data[0];
                return vm.cardIssuance;
            });
        }



    }
})();
