(function () {
    'use strict';
    var controllerId = 'MISUpdateProductIN';
    angular
        .module('app')
        .controller('MISUpdateProductIN', MISUpdateProductIN);

    MISUpdateProductIN.$inject = ['$location', '$routeParams', '$scope', '$window', 'common', 'datacontext', 'model', 'resourceService'];

    function MISUpdateProductIN($location, $routeParams, $scope, $window, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.goBack = goBack;
        vm.save = save;
        vm.selectedClientVariant = [];
        $scope.message = "";

        vm.cardTypes = [];
        vm.createVault = false;
        vm.productName = false;
        vm.card = {};
        vm.copyText = copyText;
        activate();

        function copyText() {
            //vm.product.name = '';
            var variant = '';
            if (vm.product.variant !== undefined) {
                variant = vm.product.variant;
            } else {
                variant = '';
            }
            vm.product.name = vm.client.shortCode + ' ' + vm.product.sidCardType.name + ' ' + variant;
        }

        function activate() {
            initLookups();
            var promises = [getRequestedProduct()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated X JobDetails View'); });
        }

        function initLookups(clientId) {
            var lookups = datacontext.lookup.lookupCachedData;
            vm.sidClients = lookups.clients;
            vm.cardTypes = lookups.sidCardTypes;

            //var clientId = $routeParams.clientId;
            angular.forEach(vm.sidClients, function (todo, key) {
                if (todo.id == clientId) {
                    vm.client = todo;
                    vm.card.clientName = todo.name;
                }
            });
        }

        function getRequestedProduct() {
            var val = $routeParams.productId;
            return datacontext.inventory.getProductById(val)
                .then(function (data) {
                    vm.product = data;
                    initLookups(vm.product.sidClientId);
                    //console.log(vm.product);
                }, function (error) {
                    logError('Unable to get Product ' + val);
                });
        }

        function save() {
            vm.newEntity = {
                id: vm.product.id,
                sidClientId: vm.product.sidClient.id,
                sidCardTypeId: vm.product.sidCardType.id,
                name: vm.product.name,
                shortCode: vm.product.shortCode,
            };

            ////console.log(vm.newEntity);
            createEntity(vm.newEntity);
        }

        function createEntity(entity) {
            var clientId = $routeParams.clientId;
            var resourceUri = model.resourceUri.inventory + '/sidproduct/update';
            resourceService.updateResource(resourceUri, entity).then(function (response) {
                //console.log(response);
                $location.path('in/mis/card/client/' + response.data.sidClientId + '/products')
            },
                function (response) {
                    //console.log(response);
			     $scope.message = "Failed to save due to: " + response.data.message;
			 });
        }

        function goBack() { $window.history.back(); }

    }


})();
