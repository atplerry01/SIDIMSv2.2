(function () {
    'use strict';
    var controllerId = 'CardTypeDetailCO';
    angular
        .module('app')
        .controller('CardTypeDetailCO', CardTypeDetailCO);

    CardTypeDetailCO.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function CardTypeDetailCO($location, $routeParams, $scope, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.cardtypes = [];
        vm.cardtype = undefined;
        vm.goBack = goBack;
        vm.gotoCardTypes = gotoCardTypes;
        vm.save = saveCartType;

        activate();

        function activate() {
            var promises = [getCardTypes(), getRequestedCardType()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated CardTypeDetail View'); });
        }

        function getCardTypes(forceRefresh) {
            return datacontext.cardopslookup.getCardTypes(forceRefresh)
                .then(function (data) {
                    vm.cardtypes = data;
                    return vm.cardtypes;
                });
        }

        function getRequestedCardType() {
            var val = $routeParams.id;

            //console.log(val);

            if (val) {
                return datacontext.cardopslookup.getCardTypeById(val)
                .then(function (data) {
                    vm.cardtype = data;
                    //console.log(vm.cardtype);
                }, function (error) {
                    logError('Unable to get CardType ' + val);
                });
            }
        }

        function goBack() { $window.history.back(); }

        function gotoCardTypeDetail() {
            $location.path('co/lookups/card-type/:id');
        }

        function saveCartType() {
            var val = $routeParams.id;
           

            if (val === 'new') {
                // Create new entity
                vm.newEntity = {
                    name: vm.cardtype.name
                };

                createEntity(vm.newEntity);
            } else {
                // Update Entity
                vm.updateEntity = {
                    id: vm.cardtype.id,
                    name: vm.cardtype.name
                };

                updateCardTypes(vm.updateEntity);
            }
        }

        function createEntity(entity) {
            var resourceUri = model.resourceUri.lookups + '/cardtype/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                vm.cardtype = {};
                getCardTypes();
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
                $location.path('/co/lookups/card-type/' + entity.id);
            }
        }

        function updateCardTypes(entity) {
            var resourceUri = model.resourceUri.lookups + '/cardtype/update';
            resourceService.updateResource(resourceUri, entity, entity.id).then(function (response) {
                vm.cardtype = {};
                getCardTypes();
                $location.path('co/lookups/card-types')
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
