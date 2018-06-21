(function () {
    'use strict';
    var controllerId = 'DeliveryNoteIN';
    angular
        .module('app')
        .controller('DeliveryNoteIN', DeliveryNoteIN);

    DeliveryNoteIN.$inject = ['$location', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function DeliveryNoteIN($location, $scope, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        
        vm.jobs = [];
        vm.incomingJobs = [];
        vm.deliveryprofiles = [];
        vm.generateNote = generateNote;
        vm.jobNote = {};

        vm.delivery = undefined;
        vm.prepareDeliveryNote = true;
        vm.generateDeliveryNote = false;
        vm.prepareNote = prepareNote;

        activate();

        function activate() {
            var promises = [getDeliveryNotes(), getJobs()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

    
       

        function prepareNote() {
            // Check if an item is checked
            //var val = $scope.selection.objects[0].id;
            var clientEquate;
            var selectedClient;
            var newObject = [];

            //console.log($scope.selection.objects.length); // Todo
         
            angular.forEach($scope.selection.objects, function (todo, key) {
                var newObjectX = todo.job.sidClientId;
                newObject.push(newObjectX);
                selectedClient = todo.job;
            });

            if (newObject.length !== 0) {
                clientEquate = allTheSame(newObject); //Todo: if null array
            }
           
            
            if (clientEquate == true) {
                vm.prepareDeliveryNote = false;
                vm.generateDeliveryNote = true;
                vm.delivery = {
                    client: selectedClient.sidClient.name
                };

                // get Client DeliveryProfile
                getClientDeliveryProfile(selectedClient.sidClientId);

            } else {
                vm.prepareDeliveryNote = true;
                vm.generateDeliveryNote = false;
            }
        }

        function getClientDeliveryProfile(entityId, forceRefresh) {
            return datacontext.dispatchjob.getDeliveryProfiles(entityId, forceRefresh).then(function (data) {
                vm.deliveryprofiles = data;
                return vm.deliveryprofiles;
            });
        }

        function getDeliveryNotes(forceRefresh) {
            return datacontext.dispatchjob.getDeliveryNotes(forceRefresh).then(function (data) {
                vm.incomingJobs = data;
                return vm.incomingJobs;
            });
        }

        function getJobs(forceRefresh) {
            return datacontext.inventjob.getJobs(forceRefresh).then(function (data) {
                vm.jobs = data;
                return vm.jobs;
            });
        }

        function gotoJobDetails(entity) {
            if (entity && entity.id) {
                $location.path('/in/card-setup/' + entity.job.id)
            }
        }

        function goBack() { $window.history.back(); }

        function allTheSame(array) {
            var first = array[0];
            return array.every(function (element) {
                return element === first;
            });
        }


        $scope.selection = {
            ids: {},
            objects: [{}]
        };

        function generateNote() {
            var newObject = [];

            if (vm.delivery.template === undefined) {
                vm.delivery.template = false;
            }

            angular.forEach($scope.selection.objects, function (todo, key) {
                var newObjectX = {
                    sidDispatchId: todo.id,
                    jobBatchTrackerId: todo.jobBatchTrackerId,
                    jobId: todo.jobId,
                    deliveryProfileId: vm.delivery.profile.id,
                    hasTemplate: vm.delivery.template,
                    description: vm.delivery.description
                };
                
                newObject.push(newObjectX);
            });

            //console.log(newObject);
            createEntity(newObject);
        }
    
        function createEntity(entity) {
            var resourceUri = model.resourceUri.inventory + '/GenerateDeliveryNote/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                getDeliveryNotes();
                $location.path('/in/dispatch/incoming-jobs');

            },
			 function (response) {
			     //console.log(response);
			     $scope.message = "Failed to save resource due to:";
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
            for (var i = 0; i < vm.incomingJobs.length; i++) {
                if (vm.incomingJobs[i].id == id) {
                    return vm.incomingJobs[i];
                }
            }
        };

    }
})();
