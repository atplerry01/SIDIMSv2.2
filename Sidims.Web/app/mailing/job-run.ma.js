(function () {
    'use strict';
    var controllerId = 'JobRunMA';
    angular
        .module('app')
        .controller('JobRunMA', JobRunMA);

    JobRunMA.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function JobRunMA($location, $routeParams, $scope, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.withSplit = false;

        vm.addRow = addRow;
        vm.machineLists = [];
        vm.revertView = revertView;

        vm.mailingModes = [];
        vm.cardissuancelogs = [];
        vm.marun = undefined;
        vm.save = save;
        vm.noSplitSave = noSplitSave;

        vm.errorMessage = '';
        $scope.message = "";
        vm.splitIsValid = false;
        vm.split = [];

        activate();

        function activate() {
            initLookups();

            var promises = [getJobs(), getRequestedJob(), getCardIssuanceLogs()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }


        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            vm.sidMachines = lookups.sidMachines;

            angular.forEach(vm.sidMachines, function (todo, key) {
                if (todo.department.name == 'Mailing') {
                    vm.stateCheck = todo.name;
                    vm.machineLists.push(todo);
                }
            });
        }

        function getRequestedJob() {
            var val = $routeParams.trackerId;
            return datacontext.resourcejob.getJobTrackerById(val)
                .then(function (data) {
                    vm.jobTracker = data;
                    //getJobs(vm.jobTracker.jobId);
                   
                    getJobSplits(vm.jobTracker.id);
                    getCardIssuanceLogs();

                    // Initialized the split data
                    vm.split.machine = vm.machineLists[0];
                    vm.split.rangeFrom = 1;
                    vm.split.rangeTo = vm.jobTracker.job.quantity;

                }, function (error) {
                    logError('Unable to get JobTracker ' + val);
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

        function getJobSplits(entityId) {
            return datacontext.resourcejob.getJobSplitByJobTrackerId(entityId)
                .then(function (data) {
                    vm.jobSplits = data;
                    //console.log(vm.jobSplits);
                }, function (error) {
                    logError('Unable to get JobSplit ' + entityId);
                });
        }

        function getBatchTracker(entityId) {
            return datacontext.resourcejob.getJobBatchTrackerByTrackerId(entityId)
                .then(function (data) {
                    //console.log(data);
                    vm.jobBatchTracker = data[0];
                    //console.log(vm.jobBatchTracker);
                }, function (error) {
                    logError('Unable to get JobSplit ' + entityId);
                });
        }


        function noSplitSave() {
            var newObject = [];

            // Compute the slit
            angular.forEach($scope.inputs, function (todo, key) {
                var newObjectX = {
                    jobTrackerId: vm.jobTracker.id,
                    departmentId: vm.split.machine.departmentId,
                    sidMachineId: vm.split.machine.id,
                    rangeFrom: vm.split.rangeFrom,
                    rangeTo: vm.split.rangeTo,
                };

                newObject.push(newObjectX);
            });

            createEntity(newObject);
        }



        $scope.inputs = [{}];

        function addRow() {
            vm.withSplit = true;
            $scope.inputs.push({});
        }

        $scope.del = function (i) {
            $scope.inputs.splice(i, 1);
        }

        function save() {
            // get the the 
            var total = 0;
            angular.forEach($scope.inputs, function (todo, key) {
                var rangeQty = (todo.rangeTo - todo.rangeFrom) + 1;

                total += rangeQty;

                if (rangeQty > 0) {
                    vm.splitIsValid = true;
                    $scope.message = "";
                } else {
                    vm.splitIsValid = false;
                    $scope.message = "Invalid Range value detected";
                }
            });

            if (vm.jobTracker.job.quantity == total) {
                vm.splitIsValid = true;
                $scope.message = "";
            } else {
                vm.splitIsValid = false;
                $scope.message = "Invalid Range value detected";
            }

            if (vm.splitIsValid === false) {
                $scope.message = "Invalid Range value detected";
            } else {
                processSplitJob();
                $scope.message = "";
            }
        }

        function processSplitJob() {
            var newObject = [];

            // Compute the slit
            angular.forEach($scope.inputs, function (todo, key) {
                var newObjectX = {
                    jobTrackerId: $routeParams.trackerId,
                    departmentId: todo.machine.departmentId,
                    sidMachineId: todo.machine.id,
                    rangeFrom: todo.rangeFrom,
                    rangeTo: todo.rangeTo,
                };

                newObject.push(newObjectX);
            });

            createEntity(newObject);
        }
        function createEntity(entity) {
            //console.log(entity);

            var resourceUri = model.resourceUri.ma + '/MailingSplitCard/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                //console.log(response);
                //vm.cardreceipt = {};
                $location.path('/ma/incoming-jobs');
            },
			 function (response) {
			     //console.log(response);
			     $scope.message = "Failed to save resource due to";
			 });
        }

        function goBack() { $window.history.back(); }


        function getCardIssuanceLogs(forceRefresh) {
            var val = $routeParams.trackerId;
            return datacontext.inventjob.getCardIssuanceLogByTrackerId(val, forceRefresh).then(function (data) {
                vm.cardissuancelogs = data;
                //console.log(vm.cardissuancelogs);
                return vm.cardissuancelogs;
            });
        }


        function getJobs(forceRefresh) {
            return datacontext.resourcejob.getJobs(forceRefresh).then(function (data) {
                vm.jobs = data;
                return vm.jobs;
            });
        }


        function revertView() {
            vm.withSplit = false;
        }

    }
})();
