(function () {
    'use strict';
    var controllerId = 'StockReceiptDetailIN';
    angular
        .module('app')
        .controller('StockReceiptDetailIN', StockReceiptDetailIN);

    StockReceiptDetailIN.$inject = ['$location', '$routeParams', 'common', 'datacontext'];

    function StockReceiptDetailIN($location, $routeParams, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.cardrequests = [];
        vm.addCardRequest = addCardRequest;
        vm.save = save;
        vm.cardrequest = undefined;

        activate();

        function activate() {
            initLookups();

            var promises = [getRequestedSCMCardRequest()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            vm.vendors = lookups.vendors;
        }

        // ReceiptLog
        // get cardrequest
        function getRequestedSCMCardRequest() {
            var val = $routeParams.requestId;
           
            return datacontext.inventory.getSCMCardRequestById(val)
                .then(function (data) {
                    vm.cardrequest = data;
                    //console.log(vm.cardrequest);
                }, function (error) {
                    logError('Unable to get cardrequest ' + val);
                });
        }

        // get the receiptlog


        function save() {
            // Create new entity

            //console.log(vm.cardrequest);

            vm.newEntity = {
                clientVaultReportId: 1,
                vendorId: vm.cardrequest.vendors.id,
                sIDReceiverId: 1,
                embedCardRequestId: 1,
                supplierName: vm.cardrequest.deliverBy,
                lotNumber: vm.cardrequest.lotNumber,
                quantity: vm.cardrequest.batchNumber,

            };

            //console.log(vm.newEntity);
            //createEntity(vm.newEntity);
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
            //console.log(entity);
            if (entity && entity.id) {
                $location.path('in/inventory/vault-product/1/receipt/new');
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
