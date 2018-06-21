(function () {
    'use strict';
    var controllerId = 'StockCardProductRequestIN';
    angular
        .module('app')
        .controller('StockCardProductRequestIN', StockCardProductRequestIN);

    StockCardProductRequestIN.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function StockCardProductRequestIN($location, $routeParams, $scope, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.request = undefined;
        vm.vaultreport = [];
        vm.clientstockreport = [];
        vm.product = undefined;
        vm.displayReceiptLog = displayReceiptLog;

        vm.cardrequests = [];
        vm.receiptlogView = false;
        vm.saveRequest = saveRequest;
     

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
            if (entity && entity.id) {
                // get ReceiptLog
                getCardReceiptLogs(entity.id);
            }
        }

        function getCardReceiptLogs(requestId, forceRefresh) {
            return datacontext.inventory.getReceiptLogByRequestId(requestId, forceRefresh).then(function (data) {
                vm.cardreceiptlogs = data;
                if (vm.cardreceiptlogs.length !== 0) {
                    vm.receiptlogView = true;
                }

                //console.log(vm.cardreceiptlogs);
                return vm.cardreceiptlogs;
            });
        }

        function saveRequest() {
            var newRequest = {
                orderNumber: vm.request.orderNumber,
                totalBatchQty: vm.request.quantity,
                createdById: 0,
                sidProductId: $routeParams.id
            };

            //console.log(newRequest);
            createEntity(newRequest);
        }

        function createEntity(entity) {
            var resourceUri = model.resourceUri.inventory + '/cardrequest/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                //console.log(response);
                vm.request = {};
                $location.path('/in/inventory/vault-product/' + $routeParams.id);
            },
			 function (response) {
			     //console.log(response);
			     $scope.message = "Failed to save resource due to:";
			 });
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
