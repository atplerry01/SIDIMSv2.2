(function () {
    'use strict';
    var controllerId = 'ClientWasteDP';
    angular
        .module('app')
        .controller('ClientWasteDP', ClientWasteDP);

    ClientWasteDP.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function ClientWasteDP($location, $routeParams, $scope, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.confirmMADelivery = confirmMADelivery;
        vm.carddelivery = [];
        vm.dispatchDelivery = [];
        vm.pendingwaste = [];

        vm.prepareNote = prepareNote;
        vm.generateNote = generateNote;

        vm.prepareDeliveryNote = true;
        vm.generateDeliveryNote = false;


        activate();

        function activate() {
            var promises = [getProductionUsers(), getPendingWaste(), getAllJobTrackers(), getJobTrackers(), getJobs()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getPendingWaste(forceRefresh) {
            var val = $routeParams.clientId;
            return datacontext.dispatchjob.getPendingCardWaste(val, forceRefresh).then(function (data) {
                vm.pendingwaste = data;
                return vm.pendingwaste;
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

                var newObjectX = {
                    sidClientId: $routeParams.clientId,
                    jobTrackerId: todo.jobTrackerId,
                    CardWasteAnalysisId: todo.id,
                    hasTemplate: vm.delivery.template,
                    deliveryProfileId: vm.delivery.profile.id,
                    description: vm.delivery.description
                };

                newObject.push(newObjectX);
            });

            createNoteEntity(newObject);
        }

        function createNoteEntity(entity) {
            var resourceUri = model.resourceUri.inventory + '/GenerateWasteNote/create';
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
            for (var i = 0; i < vm.pendingwaste.length; i++) {
                if (vm.pendingwaste[i].id == id) {
                    return vm.pendingwaste[i];
                }
            }
        };


    }
})();
