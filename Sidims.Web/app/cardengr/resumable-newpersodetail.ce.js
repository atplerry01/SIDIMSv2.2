(function () {
    'use strict';
    var controllerId = 'ResumableNewPersoDetailCE';
    angular
        .module('app')
        .controller('ResumableNewPersoDetailCE', ResumableNewPersoDetailCE);

    ResumableNewPersoDetailCE.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext', 'model', 'resourceService', 'authService'];

    function ResumableNewPersoDetailCE($location, $routeParams, $scope, common, datacontext, model, resourceService, authService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.cardIssuance = undefined;
        vm.ceJobSplit = undefined;
        vm.jobSplitCEAnalysis = [];
        vm.cardissuancelogs = [];
        vm.job = [];
        vm.jobSplits = [];
        vm.save = save;
        vm.updateJobSplit = updateJobSplit;
        vm.saveDeliverable = saveDeliverable;
        vm.deleteDelivery = deleteDelivery;
        vm.carddeliverylogs = [];
        vm.getTotal = getTotal;
        vm.refreshDeliveryLog = refreshDeliveryLog;
        vm.displayJobSplitDetails = displayJobSplitDetails;
        vm.letMeHandleJob = letMeHandleJob;
        vm.jobSplitDetail = false;
        vm.isSaving = false;
        vm.partial = {};
        vm.isHandler = false;

        activate();

        function activate() {
            var promises = [getRequestedJob(), getProductionStaffs(), getUserDetails()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        Object.defineProperty(vm, 'canSave', { get: canSave });
        function canSave() { return !vm.isSaving; }

        function getRequestedJob(forceRefresh) {
            var val = $routeParams.id;
            return datacontext.resourcejob.getJobTrackerById(val, forceRefresh)
                .then(function (data) {
                    vm.jobTracker = data;
                    getJobSplits(vm.jobTracker.id);
                    getCEJobSplitAnalysis(vm.jobTracker.id);
                    getJobs(vm.jobTracker.jobId);
                    //getCardIssuance(vm.jobTracker.id);
                }, function (error) {
                    logError('Unable to get JobTracker ' + val);
                });
        }

        function getUserDetails() {
            var auth = authService.authentication;
            var username = auth.userName;

            return datacontext.application.getUserDetail(username)
                .then(function (data) {
                    vm.userInfo = data;
                    //console.log(vm.userInfo);
                }, function (error) {
                    logError('Unable to get JobSplit ' + entityId);
                });
        }

        function refreshDeliveryLog() {
            getCardDeliveryLogs();
        }

        function getCardIssuance(entityId, forceRefresh) {
            return datacontext.resourcejob.getCardIssuanceByTrackerId(entityId, forceRefresh).then(function (data) {
                vm.cardIssuance = data[0];
                return vm.cardIssuance;
            });
        }

        function getTotal(forceRefresh) {
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

        function getCEJobSplitAnalysis(entityId) {
            return datacontext.resourcejob.getIncomingCESplitAnalysisByJobTrackerId(entityId)
                .then(function (data) {
                    vm.jobSplitCEAnalysis = data;
                    vm.partial.quantityBad = vm.jobSplitCEAnalysis.quantityBad;
                    vm.partial.quantityHeld = vm.jobSplitCEAnalysis.quantityHeld;
                }, function (error) {
                    logError('Unable to get JobSplit ' + entityId);
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

        function getProductionStaffs(forceRefresh) {
            return datacontext.inventaccount.getProductionStaffs(forceRefresh).then(function (data) {
                vm.staffs = data;
                //console.log(vm.staffs);
                return vm.staffs;
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

        function getCardIssuanceLogs(forceRefresh) {
            var val = $routeParams.id;
            return datacontext.inventjob.getCardIssuanceLogByTrackerId(val, forceRefresh).then(function (data) {
                vm.cardissuancelogs = data;
                //console.log(vm.cardissuancelogs);
                return vm.cardissuancelogs;
            });
        }


        function save() {
            if (!canSave()) { return $q.when(null); }

            vm.newEntity = {
                jobId: vm.jobTracker.jobId
            };
        }

        function createEntity(entity) {
            var val = $routeParams.id;
            var resourceUri = model.resourceUri.ce + '/resumenewjob/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
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

                    //jobTracker, jobSplit, handler
                    getJobHandler(vm.ceJobSplit.jobSplitId);

                    vm.partial.quantityBad = vm.ceJobSplit.quantityBad;
                    vm.partial.quantityHeld = vm.ceJobSplit.quantityHeld;

                }, function (error) {
                    logError('Unable to get jobSplitCEAnalysis ' + val);
                });
        }

        function getJobHandler(jobSplitId, forceRefresh) {
            return datacontext.resourcejob.getJobHandler(jobSplitId, forceRefresh).then(function (data) {
                vm.jobHandler = data[0];

                //console.log(vm.jobHandler);

                var auth = authService.authentication;
                var pageView = auth.page;

                if (vm.jobHandler.handlerId === vm.userInfo[0].id) {
                    vm.isHandler = true;
                } 
                else if (pageView == 'CardEngr Supervisor') {
                    vm.isHandler = true;
                } else {
                    vm.isHandler = false;
                }

                return vm.jobHandler;
            });
        }

      
        vm.fixModel = {};

        function updateJobSplit() {
            var newEntity = {
                id: vm.ceJobSplit.id,
                jobTrackerId:  $routeParams.id,
                jobSplitId: vm.ceJobSplit.jobSplitId,
                quantityGood: vm.ceJobSplit.quantityGood,
                quantityHeld: vm.partial.quantityHeld,
                quantityBad: vm.partial.quantityBad,
                createdById: vm.ceJobSplit.createdById,
                createdOn: vm.ceJobSplit.createdOn
            };

            updateJobSplitEntity(newEntity);
        }

        function updateJobSplitEntity(entity) {
            var resourceUri = model.resourceUri.ce + '/jobslit-ce-analysis/update';
            resourceService.updateResource(resourceUri, entity).then(function (response) {
                getRequestedJob(true);
                getJobSplits(vm.jobTracker.id);
                getCEJobSplitAnalysis(vm.jobTracker.id);
            },
			 function (response) {
			     //console.log(response);
			     $scope.message = "Failed to save resource due to:";
			 });
        }

        vm.del = {};

        function saveDeliverable() {
            //console.log(vm.del);
            var entity = {
                jobTrackerId: $routeParams.id,
                rangeFrom: vm.del.rangeFrom,
                rangeTo: vm.del.rangeTo
            };

            var rangeVal = ((vm.del.rangeFrom - vm.del.rangeTo) + 1);
            var newQty = (rangeVal + vm.getRangeTotal + vm.cardIssuance.totalHeld);

            //Todo: plus heldcard
            if (newQty > vm.cardIssuance.totalQuantityIssued) {
                ////console.log('Quantity Surpass');
            } else {
                ////console.log('Ok');
            }

            deliveryCreateEntity(entity);
        }

        function deliveryCreateEntity(entity) {
            var val = $routeParams.id;
            var resourceUri = model.resourceUri.ce + '/carddeliverylog/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                //console.log(response);
                getCardDeliveryLogs();
                vm.del = {};
            },
                function (response) {
                    //console.log(response);
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
            var resourceUri = model.resourceUri.ce + '/carddeliverylog/delete';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                getCardDeliveryLogs();
            },
                function (response) {
                    //console.log(response);
            });
        }

        function letMeHandleJob(entity) {
            vm.ceHandler = {
                id: entity.id
            };

            updateCEAnalysis(vm.ceHandler);
        }
        

        function updateCEAnalysis(entity) {
            var resourceUri = model.resourceUri.ce + '/jobhandle/update';
            resourceService.updateResource(resourceUri, entity).then(function (response) {
                //console.log(response);
            },
			 function (response) {
			     //console.log(response);
			     $scope.message = "Failed to save resource due to:";
			 });
        }


    }
})();
