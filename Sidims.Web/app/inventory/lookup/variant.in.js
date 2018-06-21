(function () {
    'use strict';
    var controllerId = 'ClientIN';
    angular
        .module('app')
        .controller('ClientIN', ClientIN);

    ClientIN.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function ClientIN($location, $routeParams, $scope, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.addClient = gotoClient;
        vm.clients = [];
        vm.client = undefined;
        vm.goBack = goBack;

        vm.gotoCardTypes = gotoCardTypes;
        vm.save = saveClients;
        vm.sectors = [];

        activate();

        function activate() {
            initLookups();

            var promises = [getClients(), getRequestedClients()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Clients View'); });
        }


        // get lookups
        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            vm.sectors = lookups.sectors;
        }

        function getClients(forceRefresh) {
            return datacontext.cardopslookup.getClients(forceRefresh).then(function (data) {
                    vm.clients = data;
                    //console.log(vm.clients);
                    return vm.clients;
                });
        }

        function getRequestedClients() {
            var val = $routeParams.id;

            if (val) {
                return datacontext.cardopslookup.getClientById(val)
                .then(function (data) {
                    vm.client = data;
                    //console.log(vm.client);
                }, function (error) {
                    logError('Unable to get client ' + val);
                });
            }
        }

        function goBack() { $window.history.back(); }

        function gotoClient() {
            $location.path('co/lookups/client/new');
        }

        // Todo
        function saveClients() {
            var val = $routeParams.id;

            if (val === 'new' || '') {
                // Create new entity
                vm.newEntity = {
                    sectorId: vm.client.sector.id,
                    name: vm.client.name
                };

                createEntity(vm.newEntity);
            } else {
                // Update Entity
                vm.updateEntity = {
                    id: vm.client.id,
                    sectorId: vm.client.sector.id,
                    name: vm.client.name
                };

                updateClients(vm.updateEntity);
            }
        }

        function createEntity(entity) {
            var resourceUri = model.resourceUri.lookups + '/client/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                vm.client = {};
                getClients();
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

        function gotoCardTypes(entity) {
            if (entity && entity.id) {
                $location.path('/co/lookups/client/' + entity.id);
            }
        }

        function updateClients(entity) {
            var resourceUri = model.resourceUri.lookups + '/client/update';
            resourceService.updateResource(resourceUri, entity, entity.id).then(function (response) {
                vm.client = {};
                getClients();
                $location.path('co/lookups/clients')
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

    }
})();
