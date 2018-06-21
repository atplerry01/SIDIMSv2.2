(function () {
    'use strict';
    var controllerId = 'StockReceiptIN';
    angular
        .module('app')
        .controller('StockReceiptIN', StockReceiptIN);

    StockReceiptIN.$inject = ['$location', '$routeParams', 'common', 'datacontext'];

    function StockReceiptIN($location, $routeParams, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.cardrequests = [];
        vm.addCardRequest = addCardRequest;
        vm.gotoCardReceiptLogs = gotoCardReceiptLogs;

        //vm.clientProducts = [];
        //vm.gotoclientProductDetails = gotoclientProductDetails;

        activate();

        function activate() {
            
            var promises = [getSCMCardRequests()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }


        function getSCMCardRequests(forceRefresh) {
            var val = $routeParams.id;
            
            return datacontext.inventory.getEmbedCardRequestByProducts(val, forceRefresh).then(function (data) {
                vm.cardrequests = data;
                //console.log(vm.cardrequests)
                return vm.cardrequests;
            });
        }


        function addCardRequest(entity) {
            $location.path('in/inventory/vault-product/1/receipt/new');
        }

        function gotoCardReceiptLogs(entity) {
            if (entity && entity.id) {
                $location.path('in/inventory/vault-product/1/receipt/' +entity.id);
            }
        }









        function getClientDetails(forceRefresh) {
            var val = $routeParams.id;

            return datacontext.inventory.getProductById(val, forceRefresh).then(function (data) {
                vm.product = data;
                //console.log(vm.product);
                return vm.product;
            });
        }

        // get ClientVaultReport
        function getClientVaultReports(forceRefresh) {
            var val = $routeParams.id;

            return datacontext.inventory.getClientVaultReports(val, forceRefresh).then(function (data) {
                vm.vaultreport = data;
                return vm.vaultreport;
            });
        }

        // ClientStockReport (Daily)
        function getClientStockReports(forceRefresh) {
            var val = $routeParams.id;

            return datacontext.inventory.getClientStockReports(val, forceRefresh).then(function (data) {
                vm.clientstockreports = data;
                //console.log(vm.clientstockreports);
                return vm.clientstockreports;
            });
        }














        function getProducts(forceRefresh) {
            return datacontext.inventory.getAllClientProducts(forceRefresh).then(function (data) {
                vm.clientProducts = data;
                //console.log(vm.clientProducts);
                return vm.clientProducts;
            });
        }

        function gotoclientProductDetails(entity) {
            //in/mis/card/client/:clientId/product/:productId/reports
            if (entity && entity.id) {
                $location.path('/in/mis/card/client/:clientId/product/:productId/reports')
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
