(function () {
    'use strict';
    var controllerId = 'MISCreateProductIN';
    angular
        .module('app')
        .controller('MISCreateProductIN', MISCreateProductIN);

    MISCreateProductIN.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function MISCreateProductIN($location, $routeParams, $scope, common, datacontext, model, resourceService) {
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

        //Todo: Get List of Engineer

        function copyText() {
            var variant = '';
            if (vm.card.variant !== undefined) variant = vm.card.variant;
            vm.card.productName = vm.client.shortCode + ' ' + vm.card.cardType.name + ' ' + variant ;
        }

        function activate() {

            initLookups();
            
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated X JobDetails View'); });
        }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            vm.sidClients = lookups.clients;
            vm.cardTypes = lookups.sidCardTypes;

            //console.log(vm.sidClients);

            var clientId = $routeParams.clientId;
            angular.forEach(vm.sidClients, function (todo, key) {
                if (todo.id == clientId) {
                    vm.client = todo;
                    vm.card.clientName = todo.name;
                }
            });

            //copyText();
        }

        function save() {
            vm.newEntity = {
                sidClientId: vm.client.id,
                sidCardTypeId: vm.card.cardType.id,
                variant: vm.card.variant,
                name: vm.card.productName,
                shortCode: vm.card.productName,
            };

            if (vm.card.productName !== undefined) {
                createEntity(vm.newEntity);
            } else {
                //console.log('null');
                $scope.message = 'Error Product Name';
            }
            //
        }

        function createEntity(entity) {
            var resourceUri = model.resourceUri.inventory + '/product/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                vm.card.productName = '';
                vm.card.productShortCode = '';
            },
			 function (response) {
			     $scope.message = "Failed to save due to: " + response.data.message;
			 });
        }


        //get ClientInfo
        
        function goBack() { $window.history.back(); }
        
    }


})();
