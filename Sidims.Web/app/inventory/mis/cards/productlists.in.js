(function() {
    'use strict';
    var controllerId = 'MISCardProductListIN';
    angular
        .module('app')
        .controller('MISCardProductListIN', MISCardProductListIN);

    MISCardProductListIN.$inject = ['$location', '$routeParams', 'common', 'config', 'datacontext', 'model', 'resourceService', '$scope'];

    function MISCardProductListIN($location, $routeParams, common, config, datacontext, model, resourceService, $scope) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;

        vm.products = [];
        vm.delete = deleteProduct;
        vm.update = updateProduct;
        vm.gotoAddProduct = gotoAddProduct;
        vm.serviveType = serviveType;
        vm.createImage = createImage;

        activate();

        function activate() {
            initLookups();
            var promises = [getProducts()];
            common.activateController(promises, controllerId)
                .then(function() {
                    log('Activated Jobs View');
                });
        }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            vm.productServices = lookups.productServices;

            //copyText();
        }


        function serviveType(product) {
            var clientId = $routeParams.clientId;
            $location.path('/in/mis/card/product/' + product.id + '/service-type');
        }

      

        function getProducts(forceRefresh) {
            var val = $routeParams.clientId;
            return datacontext.inventory.getClientProducts(val, forceRefresh).then(function(data) {
                vm.products = data;
                return vm.products;
            });
        }

        function deleteProduct(entity) {
            var newEntity = {
                id: entity.id
            }

            var resourceUri = model.resourceUri.product + '/delete';
            resourceService.saveResource(resourceUri, newEntity).then(function(response) {
                getProducts();
            },
                function(response) {
                    $scope.message = "Failed to save due to: " + response.data.message;
                });

        }

        function updateProduct(product) {
            $location.path('/in/mis/card/product/' + product.id + '/update');
        }

        function gotoAddProduct(entity) {
            var val = $routeParams.clientId;
            //console.log(val);
            $location.path('/in/mis/card/product/' + val + '/create');
        }

        function createImage(product) {
            $location.path('/in/mis/card/product/' + product.id + '/image/update');
        }

        function goBack() { $window.history.back(); }

    }
})();
