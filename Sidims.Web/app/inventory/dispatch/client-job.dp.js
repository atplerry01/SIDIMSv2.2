(function () {
    'use strict';
    var controllerId = 'ClientJobDP';
    angular
        .module('app')
        .controller('ClientJobDP', ClientJobDP);

    ClientJobDP.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function ClientJobDP($location, $routeParams, $scope, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.confirmMADelivery = confirmMADelivery;
        vm.carddelivery = [];
        vm.dispatchDelivery = [];
        vm.prepareNote = prepareNote;
        vm.generateNote = generateNote;

        vm.prepareDeliveryNote = true;
        vm.generateDeliveryNote = false;

        activate();

        function activate() {
            var promises = [getMADeliveryLogs(), getProductionUsers(), getDispatchDelivery(), getAllJobTrackers(), getJobTrackers(), getJobs()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getDispatchDelivery(forceRefresh) {
            var val = $routeParams.clientId;
            return datacontext.dispatchjob.getDispatchDelivery(val, forceRefresh).then(function (data) {
                vm.dispatchDelivery = data;
                return vm.dispatchDelivery;
            });
        }

        function getJobTrackers(forceRefresh) {
            return datacontext.resourcejob.getDispatchJobTracker(forceRefresh).then(function (data) {
                vm.jobTrackers = data;
                return vm.jobTrackers;
            });
        }

        function getAllJobTrackers(forceRefresh) {
            return datacontext.resourcejob.getAllJobTrackers(forceRefresh).then(function (data) {
                vm.allJobTrackers = data;
                return vm.allJobTrackers;
            });
        }

        function getMADeliveryLogs(forceRefresh) {
            var val = $routeParams.clientId;
            return datacontext.resourcejob.getDPCardDeliveryLogByClientId(val, forceRefresh).then(function (data) {
                vm.carddelivery = data;
                return vm.carddelivery;
            });
        }

        function getProductionUsers(forceRefresh) {
            return datacontext.inventaccount.getProductionStaffs(forceRefresh).then(function (data) {
                vm.users = data;
                return vm.users;
            });
        }

        function goBack() { $window.history.back(); }

        function confirmMADelivery(entity) {
            vm.newEntity = {
                cardDeliveryLogId: entity.id,
                sidClientId: $routeParams.clientId,
                jobTrackerId: entity.jobTrackerId,
                rangeFrom: entity.rangeFrom,
                rangeTo: entity.rangeTo
            };

            createEntity(vm.newEntity);
        }
        
        function createEntity(entity) {
            var resourceUri = model.resourceUri.inventory + '/DispatchDelivery/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                    getMADeliveryLogs();
                    getDispatchDelivery();
                },
                function (response) {
                    
                });
        }

        function getJobs(forceRefresh) {
            return datacontext.inventjob.getJobs(forceRefresh).then(function (data) {
                vm.jobs = data;
                return vm.jobs;
            });
        }

        $scope.selection = {
            ids: {},
            objects: [{}]
        };

        function prepareNote() {
            var clientEquate;
            var selectedClient;
            var newObject = [];

            angular.forEach($scope.selection.objects, function (todo, key) {
                selectedClient = todo.jobTracker.job;
            });

            //
            vm.prepareDeliveryNote = false;
            vm.generateDeliveryNote = true;

            vm.delivery = {
                client: selectedClient.sidClient.name
            };

            getClientDeliveryProfile(selectedClient.sidClientId);
        }

        function generateNote() {
            var newObject = [];
            var jobTags = [];

            if (vm.delivery.template === undefined) {
                vm.delivery.template = false;
            }

            angular.forEach($scope.selection.objects, function (todo, key) {

                //var jobString = todo.jobTracker.job.jobName;
                //var result = jobString.replace(/ /g, '_');

                //var newJobTags = {
                //    tags: result  //todo.jobTracker.job.jobName
                //};

                //jobTags.push(newJobTags);

                //clean the jobName and addit to the tags list

                var newObjectX = {
                    dispatchDeliveryId: todo.id,
                    sidClientId: $routeParams.clientId,
                    jobTrackerId: todo.jobTrackerId,
                    rangeFrom: todo.rangeFrom,
                    rangeTo: todo.rangeTo,
                    jobId: todo.jobTracker.jobId,
                    hasTemplate: vm.delivery.template,
                    deliveryProfileId: vm.delivery.profile.id,
                    description: vm.delivery.description
                };

                newObject.push(newObjectX);
            });

            ////console.log(jobTags);

            //var fruits = ["Banana", "Orange", "Apple", "Mango"];
            //var energy = jobTags.join();
            ////console.log(energy);
            createNoteEntity(newObject);
        }

        function createNoteEntity(entity) {
            var resourceUri = model.resourceUri.inventory + '/GenerateDeliveryNote/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                //getDeliveryNotes();
                $location.path('/in/dispatch/incoming-jobs');
            },
			 function (response) {
			     $scope.message = "Failed to save resource due to:";
			 });
        }


        function getClientDeliveryProfile(entityId, forceRefresh) {
            return datacontext.dispatchjob.getDeliveryProfiles(entityId, forceRefresh).then(function (data) {
                vm.deliveryprofiles = data;
                return vm.deliveryprofiles;
            });
        }

        $scope.$watch(function () {
            return $scope.selection.ids;
        }, function (value) {
            $scope.selection.objects = [];
            angular.forEach($scope.selection.ids, function (v, k) {
                v && $scope.selection.objects.push(getCategoryById(k));
            });
        }, true);

        function getCategoryById(id) {
            for (var i = 0; i < vm.dispatchDelivery.length; i++) {
                if (vm.dispatchDelivery[i].id == id) {
                    return vm.dispatchDelivery[i];
                }
            }
        };


    }
})();
