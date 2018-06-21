(function () {
    'use strict';
    var controllerId = 'StockCardProductListIN';
    angular
        .module('app')
        .controller('StockCardProductListIN', StockCardProductListIN);

    StockCardProductListIN.$inject = ['$location', '$routeParams', 'common', 'datacontext'];

    function StockCardProductListIN($location, $routeParams, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.clientProducts = [];
        vm.gotoclientProductDetails = gotoclientProductDetails;

        activate();

        function activate() {
            
            var promises = [getProducts()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getProducts(forceRefresh) {
            return datacontext.inventory.getAllClientProducts(forceRefresh).then(function (data) {
                vm.clientProducts = data;
                //console.log(vm.clientProducts);
                return vm.clientProducts;
            });
        }

        function gotoclientProductDetails(entity) {
            if (entity && entity.id) {
                $location.path('/in/inventory/vault-product/' + entity.id);
            }
        }






        function getJobs(forceRefresh) {
            return datacontext.resourcejob.getJobs(forceRefresh).then(function (data) {
                vm.jobs = data;
                //console.log(vm.jobs);
                return vm.jobs;
            });
        }

        function gotoJobDetails(entity) {
            if (entity && entity.id) {
                $location.path('/co/job/' + entity.id)
            }
        }

        function goBack() { $window.history.back(); }

    
    }
})();
