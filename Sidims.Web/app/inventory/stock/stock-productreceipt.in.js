(function () {
    'use strict';
    var controllerId = 'StockCardProductReceiptIN';
    angular
        .module('app')
        .controller('StockCardProductReceiptIN', StockCardProductReceiptIN);

    StockCardProductReceiptIN.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function StockCardProductReceiptIN($location, $routeParams, $scope, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.cardrequest = undefined;
        vm.vaultreport = [];
        vm.clientstockreport = [];
        vm.product = undefined;

        vm.cardrequests = [];
        vm.receiptlogView = false;
        vm.save = save;
        vm.createProductVault = createProductVault;
        vm.createVault = false;

        activate();

        function activate() {
            initLookups();

            var promises = [getClientDetails(), getProductVault()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            vm.vendors = lookups.vendors;
        }

        function getClientDetails(forceRefresh) {
            var val = $routeParams.id;
            return datacontext.inventory.getProductById(val, forceRefresh).then(function (data) {
                vm.product = data;
                //console.log(vm.product);
                return vm.product;
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

        function createProductVault() {
            vm.newVault = {
                sidProductId: $routeParams.id,
                openingStock: 0,
                closingStock: 0
            };

            var resourceUri = model.resourceUri.inventory + '/ClientVault/create';
            resourceService.saveResource(resourceUri, vm.newVault).then(function (response) {
                getProductVault();
                vm.createVault = false; //
            },
			 function (response) {
			     $scope.message = "Failed to save due to: "
                     + response.data.message;
			 });

        }

        function save() {

            //console.log(vm.vaultreport[0]);
            //console.log(vm.cardrequest);

            if (vm.vaultreport[0] === undefined) {
                $scope.message = "Product Vault not found";
            } else {
                var newRequest = {
                    clientVaultReportId: vm.vaultreport[0].id,
                    vendorId: vm.cardrequest.vendor.id,
                    sIDReceiverId: 1,
                    sidProductId: $routeParams.id,
                    embedCardRequestId: $routeParams.requestId,
                    supplierName: vm.cardrequest.deliverBy,
                    lotNumber: vm.cardrequest.lotNumber,
                    quantity: vm.cardrequest.batchNumber,
                };

                //console.log(newRequest);
                createEntity(newRequest);
            }

           
        }

        function createEntity(entity) {
            var resourceUri = model.resourceUri.inventory + '/cardreceipt/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                //console.log(response);
                vm.request = {};
                $location.path('/in/inventory/vault-product/' + $routeParams.id);
            },
			 function (response) {
			     //console.log(response.data.message);
			     $scope.message = response.data.message;
			 });
        }



        //// getCardRequest
        //function getCardRequests(forceRefresh) {
        //    var val = $routeParams.id;
        //    return datacontext.inventory.getEmbedCardRequestByProducts(val, forceRefresh).then(function (data) {
        //        vm.cardrequests = data;
        //        //console.log(vm.cardrequests);
        //        return vm.cardrequests;
        //    });
        //}

        //function displayReceiptLog(entity) {
        //    if (entity && entity.id) {
        //        // get ReceiptLog
        //        getCardReceiptLogs(entity.id);
        //    }
        //}

        //function getCardReceiptLogs(requestId, forceRefresh) {
        //    return datacontext.inventory.getReceiptLogByRequestId(requestId, forceRefresh).then(function (data) {
        //        vm.cardreceiptlogs = data;
        //        if (vm.cardreceiptlogs.length !== 0) {
        //            vm.receiptlogView = true;
        //        }

        //        //console.log(vm.cardreceiptlogs);
        //        return vm.cardreceiptlogs;
        //    });
        //}

        







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
