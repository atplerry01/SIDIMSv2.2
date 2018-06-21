(function () {
    'use strict';
    var controllerId = 'InventoryCardRequestDetailIN';
    angular
        .module('app')
        .controller('InventoryCardRequestDetailIN', InventoryCardRequestDetailIN);

    InventoryCardRequestDetailIN.$inject = ['$location', '$routeParams', '$scope', '$window', 'common', 'datacontext', 'model', 'resourceService'];

    function InventoryCardRequestDetailIN($location, $routeParams, $scope, $window, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.addCardRequest = addCardRequest;
        vm.cardrequests = [];
        vm.cardrequest = undefined;
        vm.goBack = goBack;

        vm.gotoCardRequests = gotoCardRequests;
        vm.save = saveClients;
        vm.sectors = [];
        vm.clients = [];
        vm.sidCardTypes = [];
        vm.sidVariants = [];
        vm.sidChipTypes = [];

        activate();

        function activate() {
            initLookups();

            var promises = [getSCMCardRequests(), getRequestedSCMCardRequest()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Clients View'); });
        }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            //console.log(lookups);

            vm.sectors = lookups.sectors;
            vm.clients = lookups.clients;
            vm.sidVariants = lookups.sidVariants;
            vm.sidCardTypes = lookups.sidCardTypes;
            vm.sidChipTypes = lookups.sidChipTypes;

            //console.log(vm.sidChipTypes);
        }

        function getSCMCardRequests(forceRefresh) {
            return datacontext.inventory.getEmbedCardRequests(forceRefresh).then(function (data) {
                vm.cardrequests = data;
                return vm.cardrequests;
            });
        }

        function getRequestedSCMCardRequest() {
            var val = $routeParams.id;

            if (val !== undefined && val !== 'new') {
                return datacontext.inventory.getSCMCardRequestById(val)
                .then(function (data) {
                    vm.cardrequest = data;
                    //console.log(vm.cardrequest);
                }, function (error) {
                    logError('Unable to get cardrequest ' + val);
                });
            }
        }

        function goBack() { $window.history.back(); }

        function addCardRequest() {
            $location.path('in/inventory/card-request/new');
        }

        // Todo
        function saveClients() {
            var val = $routeParams.id;

            if (val === 'new') {
                // Create new entity
                vm.newEntity = {
                    sidVariantId: vm.cardrequest.variant.id,
                    sidChipTypeId: vm.cardrequest.chiptype.id,
                    totalBatchQty: vm.cardrequest.quantity
                };

                createEntity(vm.newEntity);
            } else if (!Number.isInteger(val)) {
                // Update Entity
                vm.updateEntity = {
                    id: vm.cardrequest.id,
                    sidVariantId: vm.cardrequest.variant.id,
                    sidChipTypeId: vm.cardrequest.chiptype.id,
                    totalBatchQty: vm.cardrequest.quantity,
                };

                //console.log(vm.updateEntity);
                updateClients(vm.updateEntity);
            }
        }

        function createEntity(entity) {
            var resourceUri = model.resourceUri.inventory + '/cardrequest/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                vm.cardrequest = {};
                getSCMCardRequests();
                $location.path('/in/inventory/card-requests');
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

        function gotoCardRequests(entity) {
            if (entity && entity.id) {
                $location.path('/in/inventory/card-request/' + entity.id);
            }
        }

        function updateClients(entity) {
            var resourceUri = model.resourceUri.inventory + '/cardrequest/update';
            resourceService.updateResource(resourceUri, entity, entity.id).then(function (response) {
                vm.cardrequest = {};
                getSCMCardRequests();
                $location.path('in/inventory/card-requests')
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
