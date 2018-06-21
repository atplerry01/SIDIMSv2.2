(function () {
    'use strict';
    var controllerId = 'MISCreateProductServiceIN';
    angular
        .module('app')
        .controller('MISCreateProductServiceIN', MISCreateProductServiceIN);

    MISCreateProductServiceIN.$inject = ['$location', '$routeParams', '$scope', '$window', 'common', 'datacontext', 'model', 'resourceService'];

    function MISCreateProductServiceIN($location, $routeParams, $scope, $window, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.goBack = goBack;
        vm.save = save;
        vm.selectedClientVariant = [];
        $scope.message = "";

        vm.newProducts = [];
        vm.cardTypes = [];
        vm.serviceTypes = [];
        vm.newProducts = [];
        vm.clientProductServices = [];
        vm.createVault = false;
        vm.productName = false;
        vm.card = {};
        activate();

        function activate() {
            initLookups();
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated X JobDetails View'); });
        }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            //vm.cardTypes = lookups.sidCardTypes;
            vm.serviceTypes = lookups.serviceTypes;
            vm.sidProducts = lookups.sidProducts;
            vm.productServices = lookups.productServices;

            var productId = $routeParams.productId;

            angular.forEach(vm.productServices, function (todo, key) {
                if (todo.sidProductId == productId) {
                    //vm.card.clientName = todo.sidProduct.sidClient.name;
                    vm.clientProductServices.push(todo);
                    //console.log(todo);
                }
            });

            //// ClientProducts
            angular.forEach(vm.sidProducts, function (todo, key) {
                if (todo.id == productId) {
                    vm.card.clientName = todo.sidClient.name;
                    vm.newProducts.push(todo);
                }
            });

        }

        function save() {
            vm.newEntity = {
                sidProductId: vm.card.product.id,
                serviceTypeId : vm.card.serviceType.id
            };

            createEntity(vm.newEntity);
        }

        function createEntity(entity) {
            var resourceUri = model.resourceUri.inventory + '/product-service/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                goBack();
            },
                function (response) {
			     $scope.message = "Failed to save due to: " + response.data.message;
			 });
        }


        //get ClientInfo






        function goBack() { $window.history.back(); }
        
    }


})();
