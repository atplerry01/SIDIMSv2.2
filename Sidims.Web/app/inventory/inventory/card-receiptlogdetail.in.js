(function () {
    'use strict';
    var controllerId = 'InventCardReceiptLogDetailIN';
    angular
        .module('app')
        .controller('InventCardReceiptLogDetailIN', InventCardReceiptLogDetailIN);

    InventCardReceiptLogDetailIN.$inject = ['$location', '$routeParams', '$scope', '$window', 'common', 'datacontext', 'model', 'resourceService'];

    function InventCardReceiptLogDetailIN($location, $routeParams, $scope, $window, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.addCardReceipt = addCardReceipt
        vm.goBack = goBack;
        vm.cardreceipts = [];
        vm.cardreceipt = undefined;
        vm.vendors = [];
        vm.save = save;

        activate();

        function activate() {
            initLookups();
            var promises = [getRequestedSCMCardRequest()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated InventCardReceiptLog View'); });
        }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            //console.log(lookups);

            vm.vendors = lookups.vendors;
          
            //console.log(vm.vendors);
        }

        function getRequestedSCMCardRequest() {
            var val = $routeParams.id;

            if (val !== undefined && val !== 'new') {
                return datacontext.inventory.getSCMCardRequestById(val)
                .then(function (data) {
                    vm.cardreceipt = data;
                    //console.log(vm.cardreceipt);
                }, function (error) {
                    logError('Unable to get cardrequest ' + val);
                });
            }
        }
      
        function goBack() { $window.history.back(); }

        function addCardReceipt() {
            var val = $routeParams.id;
            $location.path('/in/inventory/card-request/' + val + '/receiptlog/new');
        }

        function save() {
            var val = $routeParams.id;

            vm.newEntity = {
                vendorId: vm.cardreceipt.vendor.id,
                supplierName: vm.cardreceipt.deliverBy,
                sIDReceiverId: vm.cardreceipt.deliverBy,
                embedCardRequestId: val, //vm.cardreceipt.id,
                lotNumber: vm.cardreceipt.lotNumber,
                quantity: vm.cardreceipt.quantity,
                timeOfReceipt: vm.cardreceipt.timeOfReceipt,
                remark: vm.cardreceipt.remark
            };

            //console.log(vm.newEntity);
            createEntity(vm.newEntity);
        }

        function createEntity(entity) {
            var val = $routeParams.id;
            var resourceUri = model.resourceUri.inventory + '/cardreceipt/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                //console.log(response);
                vm.cardreceipt = {};
                loadRequestedSCMCardRequest();
                $location.path('/in/inventory/card-request/' + val + '/receiptlogs');
                ///in/inventory/card-request/1005/receiptlogs
            },
			 function (response) {
			     var errors = [];
			     for (var key in response.data.modelState) {
			         for (var i = 0; i < response.data.modelState[key].length; i++) {
			             errors.push(response.data.modelState[key][i]);
			         }
			     }
			     $scope.message = "Failed to save resource due to:" + errors.join(' ');
			 });
        }

        function loadRequestedSCMCardRequest() {
            var val = $routeParams.id;

            if (val !== undefined && val !== 'new') {
                return datacontext.inventory.getSCMCardRequestById(val)
                .then(function (data) {
                    vm.cardrequest = data;
                    //console.log(vm.cardrequest);
                }, function (error) {
                    logError('Unable to get cardrequest ' + val);
                });
            }
        }

    
        //Todo: Get ReceiverId

    }
})();
