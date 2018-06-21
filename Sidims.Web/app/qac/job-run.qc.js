(function () {
    'use strict';
    var controllerId = 'JobRunQC';
    angular
        .module('app')
        .controller('JobRunQC', JobRunQC);

    JobRunQC.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext', 'model', 'resourceService', 'authService'];

    function JobRunQC($location, $routeParams, $scope, common, datacontext, model, resourceService, authService) {
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
        vm.displayJobSplitDetails = displayJobSplitDetails;

        vm.jobSplitDetail = false;
        vm.carddeliverylogs = [];
        vm.ceCarddeliverylogs = [];

        vm.deleteDelivery = deleteDelivery;

        vm.letMeHandleJob = letMeHandleJob;
        vm.isHandler = false;


        activate();

        function activate() {
            var promises = [getRequestedJob(), getCardDeliveryLogs(), getProductionUsers(), getUserDetails()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getRequestedJob() {
            var val = $routeParams.trackerId;
            return datacontext.resourcejob.getJobTrackerById(val)
                .then(function (data) {
                    vm.jobTracker = data;
                    getJobSplits(vm.jobTracker.id);
                    getCEJobSplitAnalysis(vm.jobTracker.id);
                    //getQCJobSplitAnalysis(vm.jobTracker.id);
                    getCardIssuanceLog(vm.jobTracker.id);
                    getJobs(vm.jobTracker.jobId);
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

        function letMeHandleJob(entity) {
            vm.ceHandler = {
                id: entity.id
            };

            updateCEAnalysis(vm.ceHandler);
        }

        function updateCEAnalysis(entity) {
            var resourceUri = model.resourceUri.qac + '/jobhandle/update';
            resourceService.updateResource(resourceUri, entity).then(function (response) {
                //console.log(response);
            },
			 function (response) {
			     //console.log(response);
			     $scope.message = "Failed to save resource due to:";
			 });
        }
            
        function getCardIssuanceLog(trackerId) {
            var val = trackerId;
            return datacontext.inventjob.getCardIssuanceLogByTrackerId(val)
                .then(function (data) {
                    vm.cardissuancelogs = data;
                }, function (error) {
                    logError('Unable to get CardIssuanceLog ' + val);
                });
        }


        function getCEJobSplitAnalysis(entityId) {
            return datacontext.resourcejob.getIncomingCESplitAnalysisByJobTrackerId(entityId)
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

        function getCardDeliveryLogs(forceRefresh) {
            var val = $routeParams.trackerId;
            return datacontext.resourcejob.getQCCardDeliveryLogByTrackerId(val, forceRefresh).then(function (data) {
                vm.carddeliverylogs = data;
                //console.log(vm.carddeliverylogs);

                return vm.carddeliverylogs;
            });
        }

        function getJobSplits(entityId) {
            return datacontext.resourcejob.getJobSplitByJobTrackerId(entityId)
                .then(function (data) {
                    vm.jobSplits = data;
                    //console.log(vm.jobSplits);
                }, function (error) {
                    logError('Unable to get JobSplit ' + entityId);
                });
        }

        // get CE Deliverables
        function getCECardDeliverables(forceRefresh) {
            var val = $routeParams.trackerId;
            return datacontext.resourcejob.getCECardDeliveryLogByTrackerId(val, forceRefresh).then(function (data) {
                vm.ceCarddeliverylogs = data;
                //console.log(vm.ceCarddeliverylogs);
                return vm.ceCarddeliverylogs;
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
            getRequestedJobSplitCEAnalysisJob(entity.id);
        }

        function getRequestedJobSplitCEAnalysisJob(entityId) {
            return datacontext.resourcejob.getJobSplitCEAnalysisById(entityId)
                .then(function (data) {
                    vm.ceJobSplit = data;
                    getJobHandler(vm.ceJobSplit.jobSplitId);
                }, function (error) {
                    logError('Unable to get jobSplitCEAnalysis ' + val);
                });
        }

        function getJobHandler(jobSplitId, forceRefresh) {
            return datacontext.resourcejob.getJobHandler(jobSplitId, forceRefresh).then(function (data) {
                vm.jobHandler = data[0];

                var auth = authService.authentication;
                var pageView = auth.page;


                if (vm.jobHandler.handlerId === vm.userInfo[0].id) {
                    vm.isHandler = true;
                }
                else if (pageView == 'QC Supervisor') {
                    vm.isHandler = true;
                } else {
                    vm.isHandler = false;
                }

                return vm.jobHandler;
            });
        }


        function updateJobSplit() {
            //vm.ceJobSplit
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
            var resourceUri = model.resourceUri.qac + '/jobslit-qc-analysis/update';
            resourceService.updateResource(resourceUri, entity).then(function (response) {
                //getQCJobSplitAnalysis(vm.jobTracker.id);
                getRequestedJob();
                $location.path('/qc/incoming-persos');
            },
			 function (response) {
			     //console.log(response);
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
			     //console.log(response);
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
            //console.log(vm.del);
            var entity = {
                jobTrackerId: $routeParams.trackerId,
                rangeFrom: vm.del.rangeFrom,
                rangeTo: vm.del.rangeTo,
                description: vm.del.description
            };
            //console.log(entity);

            var rangeVal = ((vm.del.rangeFrom - vm.del.rangeTo) + 1);
            var newQty = (rangeVal + vm.getRangeTotal + vm.cardIssuance.totalHeld);

            //console.log('getRangeTotal' + vm.getRangeTotal);
            //console.log('totalHeld' + vm.cardIssuance.totalHeld);
            //console.log('newQty' + newQty);

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
                //console.log(response);
                getCardDeliveryLogs();
                vm.del = {};
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

                updateResourceEntity(newEntity);
            }
        }

        function updateResourceEntity(entity) {
            var resourceUri = model.resourceUri.qac + '/carddeliverylogconfirm/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                //console.log(response);
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
                //console.log(vm.users);
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
                //console.log(response);
                getCardDeliveryLogs();
                //vm.cardreceipt = {};
                //$location.path('/ce/resumable/new-perso');
            },
                function (response) {
                    //console.log(response);
                });
        }

        function getTotal(forceRefresh) {
            //console.log(vm.jobSplitCEAnalysis);
            var total = 0;
            for (var i = 0; i < vm.jobSplitCEAnalysis.length; i++) {
                var unitEntity = vm.jobSplitCEAnalysis[i];
                //console.log(unitEntity);
                total += ((unitEntity.jobSplit.rangeTo - unitEntity.jobSplit.rangeFrom) + 1); //(product.price * product.quantity);
                //console.log(total);
            }
            return total;
        }

        function getTotalGood(forceRefresh) {
            var total = 0;
            for (var i = 0; i < vm.jobSplitCEAnalysis.length; i++) {
                var unitEntity = vm.jobSplitCEAnalysis[i];
                total += unitEntity.quantityGood;
                //console.log(total);
            }
            return total;
        }

        function getTotalBad(forceRefresh) {
            var total = 0;
            for (var i = 0; i < vm.jobSplitCEAnalysis.length; i++) {
                var unitEntity = vm.jobSplitCEAnalysis[i];
                total += unitEntity.quantityBad;
                //console.log(total);
            }
            return total;
        }

        function getTotalHeld(forceRefresh) {
            var total = 0;
            for (var i = 0; i < vm.jobSplitCEAnalysis.length; i++) {
                var unitEntity = vm.jobSplitCEAnalysis[i];
                total += unitEntity.quantityHeld;
                //console.log(total);
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
