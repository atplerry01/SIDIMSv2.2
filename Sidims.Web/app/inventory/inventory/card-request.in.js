(function () {
    'use strict';
    var controllerId = 'InventoryCardRequestIN';
    angular
        .module('app')
        .controller('InventoryCardRequestIN', InventoryCardRequestIN);

    InventoryCardRequestIN.$inject = ['$location', '$routeParams', '$scope', '$window', 'common', 'datacontext', 'model', 'resourceService'];

    function InventoryCardRequestIN($location, $routeParams, $scope, $window, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.addCardRequest = addCardRequest;
        vm.cardrequests = [];
        vm.cardrequest = undefined;
        vm.goBack = goBack;

        vm.gotoCardReceiptLogs = gotoCardReceiptLogs;
        vm.gotoCardRequests = gotoCardRequests;
        vm.sectors = [];
        vm.clients = [];
        vm.sidCardTypes = [];
        vm.sidVariants = [];
        vm.sidChipTypes = [];

        activate();

        function activate() {
            initLookups();

            var promises = [getSCMCardRequests(), getRequestedSCMCardRequest()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Clients View'); });
        }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            //console.log(lookups);

            vm.sectors = lookups.sectors;
            vm.clients = lookups.clients;
            vm.sidVariants = lookups.sidVariants;
            vm.sidCardTypes = lookups.sidCardTypes;
            vm.sidChipTypes = lookups.sidChipTypes;

            //console.log(vm.sidChipTypes);
        }

        function getSCMCardRequests(forceRefresh) {
            return datacontext.inventory.getEmbedCardRequests(forceRefresh).then(function (data) {
                vm.cardrequests = data;
                return vm.cardrequests;
            });
        }

        function getRequestedSCMCardRequest() {
            var val = $routeParams.id;

            if (val) {
                return datacontext.inventory.getSCMCardRequestById(val)
                .then(function (data) {
                    vm.cardrequest = data;
                    //console.log(vm.cardrequest);
                }, function (error) {
                    logError('Unable to get cardrequest ' + val);
                });
            }
        }

        function goBack() { $window.history.back(); }

        function addCardRequest() {
            $location.path('in/inventory/card-request/new');
        }

        function gotoCardReceiptLogs(entity) {
            if (entity && entity.id) {
                $location.path('/in/inventory/card-request/' +  entity.id + '/receiptlogs');
            }
        }

        function gotoCardRequests(entity) {
            if (entity && entity.id) {
                $location.path('/in/inventory/card-request/' + entity.id);
            }
        }

    }
})();
