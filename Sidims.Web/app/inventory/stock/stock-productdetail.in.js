(function () {
    'use strict';
    var controllerId = 'StockCardProductDetailIN';
    angular
        .module('app')
        .controller('StockCardProductDetailIN', StockCardProductDetailIN);

    StockCardProductDetailIN.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext'];

    function StockCardProductDetailIN($location, $routeParams, $scope, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.vaultreport = [];
        vm.clientstockreport = [];
        vm.product = undefined;
        vm.displayReceiptLog = displayReceiptLog;

        vm.cardrequests = [];
        vm.receiptlogView = false;
        vm.saveRequest = saveRequest;
        vm.saveReceipt = saveReceipt;
        vm.currentCardRequest = undefined;

        activate();

        function activate() {
            var promises = [getClientDetails(), getCardRequests(), getProductVault()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getClientDetails(forceRefresh) {
            var val = $routeParams.id;
            return datacontext.inventory.getProductById(val, forceRefresh).then(function (data) {
                vm.product = data;
                //console.log(vm.product);
                return vm.product;
            });
        }

        // getCardRequest
        function getCardRequests(forceRefresh) {
            var val = $routeParams.id;
            return datacontext.inventory.getEmbedCardRequestByProducts(val, forceRefresh).then(function (data) {
                vm.cardrequests = data;
                //console.log(vm.cardrequests);
                return vm.cardrequests;
            });
        }

        function displayReceiptLog(entity) {
            //console.log(entity);
            vm.currentCardRequest = entity;
            if (entity && entity.id) {
                // get ReceiptLog
                vm.receiptlogView = true;
                getCardReceiptLogs(entity.id);
            }
        }

        function getCardReceiptLogs(requestId, forceRefresh) {
            return datacontext.inventory.getReceiptLogByRequestId(requestId, forceRefresh).then(function (data) {
                vm.cardreceiptlogs = data;
                return vm.cardreceiptlogs;
            });
        }

        function saveRequest() {
            $location.path('in/inventory/vault-product/' + $routeParams.id + '/request/new');
        }

        function saveReceipt() {
            $location.path('in/inventory/vault-product/' + $routeParams.id + '/request/' + vm.currentCardRequest.id + '/receipt');
        }

        function getProductVault(forceRefresh) {
            var val = $routeParams.id;
            return datacontext.inventory.getClientVaultReports(val, forceRefresh).then(function (data) {
                vm.vaultreport = data;
                if (vm.vaultreport.length === 0) {
                    vm.createVault = true;
                    $scope.message = "Product Vault not found, Please create a Product Vault";
                }

                //console.log(vm.vaultreport);
                return vm.vaultreport;
            });
        }





        //// get ClientVaultReport
        //function getClientVaultReports(forceRefresh) {
        //    var val = $routeParams.id;
        //    return datacontext.inventory.getClientVaultReports(val, forceRefresh).then(function (data) {
        //        vm.vaultreport = data;
        //        return vm.vaultreport;
        //    });
        //}

        //// ClientStockReport (Daily)
        //function getClientStockReports(forceRefresh) {
        //    var val = $routeParams.id;
        //    return datacontext.inventory.getClientStockReports(val, forceRefresh).then(function (data) {
        //        vm.clientstockreports = data;
        //        //console.log(vm.clientstockreports);
        //        return vm.clientstockreports;
        //    });
        //}














        //function getProducts(forceRefresh) {
        //    return datacontext.inventory.getAllClientProducts(forceRefresh).then(function (data) {
        //        vm.clientProducts = data;
        //        //console.log(vm.clientProducts);
        //        return vm.clientProducts;
        //    });
        //}

        //function gotoclientProductDetails(entity) {
        //    //in/mis/card/client/:clientId/product/:productId/reports
        //    if (entity && entity.id) {
        //        $location.path('/in/mis/card/client/:clientId/product/:productId/reports')
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
