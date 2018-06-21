(function () {
    'use strict';
    var controllerId = 'UpdateClientIN';
    angular
        .module('app')
        .controller('UpdateClientIN', UpdateClientIN);

    UpdateClientIN.$inject = ['$location', '$routeParams', '$scope', '$window', 'common', 'datacontext', 'model', 'resourceService'];

    function UpdateClientIN($location, $routeParams, $scope, $window, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.goBack = goBack;
        vm.save = save;
        vm.selectedClientVariant = [];
        $scope.message = "";

        vm.sectors = [];
        vm.client = undefined;

        vm.createVault = false;
        vm.productName = false;
        vm.card = {};
        vm.copyText = copyText;
        activate();

        //Todo: Get List of Engineer

        function copyText() {
            var variant = '';
            if (vm.card.variant !== undefined) variant = vm.card.variant;
            vm.card.productName = vm.client.shortCode + ' ' + vm.card.cardType.name + ' ' + variant ;
        }

        function activate() {

            initLookups();
            
            var promises = [getRequestedClient()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated X JobDetails View'); });
        }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            vm.sectors = lookups.sectors;
        }

        function getRequestedClient() {
            var val = $routeParams.id;

            if (val && !isNaN(val)) {
                return datacontext.inventory.getClientById(val)
                    .then(function (data) {
                        vm.client = data;
                        return vm.client;
                    }, function (error) {
                        logError('Unable to get client ' + val);
                    });
            }
        }


        function save() {
            //console.log(vm.client);

            vm.newEntity = {
                id: vm.client.id,
                sectorId: vm.client.sector.id,
                name: vm.client.name,
                shortCode: vm.client.shortCode
            };

            //console.log(vm.newEntity);

            var val = $routeParams.id;
            if (val == 'new' && isNaN(val)) {
                //create a new entity
                //console.log('create');
                createEntity(vm.newEntity);
            } else {
                //console.log('update');
                updateEntity(vm.newEntity);
            }
      
        }

        function createEntity(entity) {
            var resourceUri = model.resourceUri.inventory + '/sidclient/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                $location.path('/in/mis/card/clients');
            },
                function (response) {
                    //console.log(response);
			     $scope.message = "Failed to save due to: " + response.data.message;
			 });
        }

        function updateEntity(entity) {
            var resourceUri = model.resourceUri.inventory + '/sidclient/update';
            resourceService.updateResource(resourceUri, entity).then(function (response) {
                $location.path('/in/mis/card/clients');
            },
                function (response) {
                    //console.log(response);
                    $scope.message = "Failed to save due to: " + response.data.message;
                });
        }


        //get ClientInfo
        
        function goBack() { $window.history.back(); }
        
    }


})();
