(function () {
    'use strict';
    var controllerId = 'CardVariantCO';
    angular
        .module('app')
        .controller('CardVariantCO', CardVariantCO);

    CardVariantCO.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function CardVariantCO($location, $routeParams, $scope, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.gotoAddVariant = gotoAddVariant;
        vm.variants = [];
        vm.variant = undefined;
        vm.goBack = goBack;

        vm.gotoVariants = gotoVariants;
        vm.save = saveVariants;
        vm.clients = [];

        activate();

        function activate() {
            initLookups();

            var promises = [getVariants(), getRequestedVariants()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Variants View'); });
        }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            vm.clients = lookups.clients;
        }

        function getVariants(forceRefresh) {
            return datacontext.cardopslookup.getVariants(forceRefresh).then(function (data) {
                vm.variants = data;
                //console.log(vm.variants);
                return vm.variants;
            });
        }

        function getRequestedVariants() {
            var val = $routeParams.id;

            //Todo
            if (val) {
                return datacontext.cardopslookup.getVariantById(val)
                .then(function (data) {
                    vm.variant = data;
                    //console.log(vm.variant);
                }, function (error) {
                    logError('Unable to get variant ' + val);
                });
            }
        }

        function goBack() { $window.history.back(); }

        function gotoAddVariant() {
            $location.path('co/lookups/card-variant/new');
        }

        // Todo
        function saveVariants() {
            var val = $routeParams.id;

            if (val === 'new' || '') {
                // Create new entity
                vm.newEntity = {
                    clientId: vm.variant.client.id,
                    name: vm.variant.name
                };

                createEntity(vm.newEntity);
            } else {
                // Update Entity
                vm.updateEntity = {
                    id: vm.variant.id,
                    clientId: vm.variant.client.id,
                    name: vm.variant.name
                };

                updateVariants(vm.updateEntity);
            }
        }

        function createEntity(entity) {
            var resourceUri = model.resourceUri.lookups + '/variant/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                vm.variant = {};
                getVariants();
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

        function gotoVariants(entity) {
            if (entity && entity.id) {
                $location.path('/co/lookups/card-variant/' + entity.id);
            }
        }

        function updateVariants(entity) {
            var resourceUri = model.resourceUri.lookups + '/variant/update';
            resourceService.updateResource(resourceUri, entity, entity.id).then(function (response) {
                vm.variant = {};
                getVariants();
                $location.path('co/lookups/card-variants')
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
