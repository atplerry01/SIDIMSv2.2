(function () {
    'use strict';
    var controllerId = 'DictionaryCO';
    angular
        .module('app')
        .controller('DictionaryCO', DictionaryCO);

    DictionaryCO.$inject = ['$location', '$route', '$routeParams', '$scope', 'common', 'config', 'datacontext', 'model', 'resourceService'];

    function DictionaryCO($location, $route, $routeParams, $scope, common, config, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;


        vm.products = [];
        vm.stockrepots = [];
        vm.productId = 0;
        vm.productName = '';

        vm.clients = [];
        vm.clientSearch = '';
        vm.filteredClients = [];
        vm.search = search;

        vm.clientCount = 0;
        vm.clientFilteredCount = 0;
        vm.paging = {
            currentPage: 1,
            maxPagesToShow: 10,
            pageSize: 10
        };
        vm.pageChanged = pageChanged;

        Object.defineProperty(vm.paging, 'pageCount', {
            get: function () {
                return Math.floor(vm.serverJobFilteredCount / vm.paging.pageSize) + 1;
            }
        });

        vm.message = "";
        vm.messageVisble = false;

        vm.dicClientName = [];
        vm.createNewClientName = false;
        vm.newClientCode = false;
        vm.updateClientCode = false;

        vm.gotoClientProducts = gotoClientProducts;
        vm.saveClientCode = saveClientCode;
        vm.createNewClientCode = createNewClientCode;
        vm.gotoClientCodeUpdateDetails = gotoClientCodeUpdateDetails;
        vm.gotoClientServiceUpdateDetails = gotoClientServiceUpdateDetails;
        vm.updateNewClientCode = updateNewClientCode;

        vm.saveServiceCode = saveServiceCode;

      

        vm.createNewServiceType = false;

        vm.saveServiceType = saveServiceType;
        //vm.updateServiceType = updateServiceType;
        vm.updateServiceType2 = updateServiceType2;

        vm.selectedService = undefined;

        activate();

        function activate() {
            initLookups();

            var promises = [getClients()];
            common.activateController(promises, controllerId)
                .then(function () {
                    log('Activated Jobs View');
                });
        }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;

            vm.clients = lookups.clients;
            vm.serviceTypes = lookups.serviceTypes;
            vm.remarks = lookups.remarks;
            vm.sectors = lookups.sectors;
            vm.sidCardTypes = lookups.sidCardTypes;
            vm.dictionaryClientNames = lookups.dictionaryClientNames;
            vm.dictionaryCardTypes = lookups.dictionaryCardTypes;
            vm.dictionaryServiceTypes = lookups.dictionaryServiceTypes;
        }

        //get clients
        function getClients(forceRefresh) {
            return datacontext.cardopslookup.getClients(forceRefresh, vm.paging.currentPage, vm.paging.pageSize, vm.clientSearch).then(function (data) {
                vm.clients = vm.filteredClients = data;
                return data;
            });
        }

        function getDictionaryClientName(clientId, forceRefresh) {
            return datacontext.cardopslookup.getDictionaryClientNames(clientId, forceRefresh).then(function (data) {
                vm.dicClientName = data;
                return data;
            });
        }

        function getDictionaryServiceTypes(clientId, forceRefresh) {
            return datacontext.cardopslookup.getDictionaryServiceTypes(clientId, forceRefresh).then(function (data) {
                vm.dicServiceType = data;
                //console.log(vm.dicServiceType);
                return data;
            });
        }

        function getClientFilteredCount() {
            vm.clientFilteredCount = datacontext.resourcejob.getServerJobFilteredCount(vm.serverJobsSearch);
        }

        function search($event) {
            if ($event.keyCode === keyCodes.esc) { vm.clientSearch = ''; }
            getClients();
        }

        function pageChanged(page) {
            if (!page) { return; }
            vm.paging.currentPage = page;
            getClients();
        }

        function gotoClientProducts(entity) {
            vm.selectedClient = entity;
            getDictionaryClientName(entity.id);
            getDictionaryServiceTypes(entity.id);

            // preload service
            vm.selectedService = entity;
        }

        function saveClientCode() {
            vm.createNewClientName = true;
            vm.createNewServiceType = false;

            vm.newClientCode = true;
            vm.updateClientCode = false;
        }

        function gotoClientCodeUpdateDetails(entity) {
            vm.createNewClientName = true;
            vm.newClientCode = false;
            vm.updateClientCode = true;

            vm.selectedClient = {
                id: entity.id,
                name: entity.sidClient.name,
                sidClientId: entity.sidClientId,
                codeName: entity.clientCodeName
            };
        }

      
        function createNewClientCode() {
            var entity = {
                sidClientId: vm.selectedClient.id,
                clientCodeName: vm.selectedClient.codeName
            }

            var resourceUri = model.resourceUri.co + '/dictionary/clientname/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                getDictionaryClientName(vm.selectedClient.id);
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

        function updateNewClientCode() {
            var entity = {
                id: vm.selectedClient.id,
                sidClientId: vm.selectedClient.sidClientId,
                clientCodeName: vm.selectedClient.codeName
            }

            var resourceUri = model.resourceUri.co + '/dictionary/clientname/update';
            resourceService.updateResource(resourceUri, entity).then(function (response) {
                //console.log(response);
                getDictionaryClientName(vm.selectedClient.sidClientId);
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

        function gotoClientServiceUpdateDetails(entity) {
            vm.createNewClientName = false;
            vm.createNewServiceType = true;

            vm.newServiceType = false;
            vm.updateServiceType = true;

            vm.selectedService = entity;
            vm.selectedService.name = entity.sidClient.name;
           
        }


        function saveServiceCode() {
            vm.createNewClientName = false;
            vm.createNewServiceType = true;

            vm.newServiceType = true;
            vm.updateServiceType = false;
        }
     
        function saveServiceType() {

            var entity = {
                sidClientId: vm.selectedService.id,
                sidCardTypeId: vm.selectedService.sidCardType.id,
                serviceTypeId: vm.selectedService.serviceType.id,
                serviceCodeName: vm.selectedService.serviceCodeName
            };

            var resourceUri = model.resourceUri.co + '/dictionary/servicetype/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                getDictionaryServiceTypes(entity.sidClientId);
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

        function updateServiceType2() {
            var entity = {
                id: vm.selectedService.id,
                sidClientId: vm.selectedService.sidClientId,
                sidCardTypeId: vm.selectedService.sidCardTypeId,
                serviceTypeId: vm.selectedService.serviceTypeId,
                serviceCodeName: vm.selectedService.serviceCodeName
            };
           
            //console.log(entity);
            var resourceUri = model.resourceUri.co + '/dictionary/servicetype/update';
            resourceService.updateResource(resourceUri, entity).then(function (response) {
                //console.log(response);
                getDictionaryServiceTypes(entity.sidClientId);
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


    }
})();
