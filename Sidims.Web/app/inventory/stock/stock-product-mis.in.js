(function () {
    'use strict';
    var controllerId = 'StockCardProductMISIN';
    angular
        .module('app')
        .controller('StockCardProductMISIN', StockCardProductMISIN);

    StockCardProductMISIN.$inject = ['$location', '$routeParams', 'common', 'datacontext'];

    function StockCardProductMISIN($location, $routeParams, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.clientProducts = [];

        activate();

        function activate() {
            var promises = [getClientStockReport()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getClientStockReport(forceRefresh) {
            var val = $routeParams.id;
            return datacontext.inventory.getClientStockReports(val, forceRefresh).then(function (data) {
                vm.stockreports = data;
                //console.log(vm.stockreports);
                return vm.stockreports;
            });
        }







        //function getProducts(forceRefresh) {
        //    return datacontext.inventory.getAllClientProducts(forceRefresh).then(function (data) {
        //        vm.clientProducts = data;
        //        //console.log(vm.clientProducts);
        //        return vm.clientProducts;
        //    });
        //}

        //function gotoclientProductDetails(entity) {
        //    if (entity && entity.id) {
        //        $location.path('/in/inventory/vault-product/' + entity.id);
        //    }
        //}

        //function getJobs(forceRefresh) {
        //    return datacontext.resourcejob.getJobs(forceRefresh).then(function (data) {
        //        vm.jobs = data;
        //        //console.log(vm.jobs);
        //        return vm.jobs;
        //    });
        //}

        //function gotoJobDetails(entity) {
        //    if (entity && entity.id) {
        //        $location.path('/co/job/' + entity.id)
        //    }
        //}

        function goBack() { $window.history.back(); }


    }
})();
