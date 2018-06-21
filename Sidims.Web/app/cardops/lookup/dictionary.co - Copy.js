(function () {
    'use strict';
    var controllerId = 'DictionaryCO';
    angular
        .module('app')
        .controller('DictionaryCO', DictionaryCO);

    DictionaryCO.$inject = ['$location', '$route', '$routeParams', 'common', 'config', 'datacontext', 'model', 'resourceService'];

    function DictionaryCO($location, $route, $routeParams, common, config, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;


        vm.products = [];
        vm.stockrepots = [];
        vm.gotoClientProducts = gotoClientProducts;
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
        vm.saveClientCode = saveClientCode;
        vm.saveServiceType = saveServiceType;

        vm.createNewClientCode = createNewClientCode;

        vm.createNewClientName = false;

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
            vm.message = "Please wait...";
            vm.messageVisble = true;

            return datacontext.cardopslookup.getClients(forceRefresh, vm.paging.currentPage, vm.paging.pageSize, vm.clientSearch).then(function (data) {
                vm.clients = vm.filteredClients = data;
                vm.message = "";
                vm.messageVisble = false;
                return data;
            });
        }

        function getDictionaryClientName(clientId, forceRefresh) {
            return datacontext.cardopslookup.getDictionaryClientNames(clientId, forceRefresh).then(function (data) {
                vm.dicClientName = vm.filteredClients = data;
                return data;
            });
        }

        function getDictionaryServiceTypes(clientId, forceRefresh) {
            return datacontext.cardopslookup.getDictionaryServiceTypes(clientId, forceRefresh).then(function (data) {
                vm.dicServiceType = vm.filteredClients = data;
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
            vm.clientId = entity.id;
            vm.selectedClient = {
                id: vm.clientId,
                name: entity.name
            }

            getDictionaryClientName(vm.selectedClient.id);
            getDictionaryServiceTypes(vm.selectedClient.id);

            //getProductWithPredicate(entity.name);
            //getServiceTypes(entity.name);
        }

        function getProductWithPredicate(pred, forceRefresh) {
            vm.dicClientName = [];
            angular.forEach(vm.dictionaryClientNames, function (todo, key) {
                if (todo.sidClient.name == pred) {
                    vm.dicClientName.push(todo);
                }
            });

        }

        function getServiceTypes(pred, forceRefresh) {
            vm.dicServiceType = [];
            angular.forEach(vm.dictionaryServiceTypes, function (todo, key) {
                if (todo.sidClient.name == pred) {
                    vm.dicServiceType.push(todo);
                }
            });

        }



        function saveClientCode(entity) {
            vm.createNewClientName = true;
        }

        function createNewClientCode() {
            var entity = {
                sidClientId: vm.selectedClient.id,
                clientCodeName: vm.selectedClient.codeName
            }

            var resourceUri = model.resourceUri.co + '/dictionary/clientname/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                var newLookups = datacontext.lookup.getAll();
                var lookups = datacontext.lookup.lookupCachedData;
                vm.dictionaryClientNames = lookups.dictionaryClientNames;

                
                console.log(vm.dictionaryClientNames);
                console.log(vm.selectedClient.name);

                vm.dicClientName = [];
                angular.forEach(vm.dictionaryClientNames, function (todo, key) {
                    if (todo.sidClient.name == vm.selectedClient.name) {
                        vm.dicClientName.push(todo);
                    }
                });

                //$route.reload();
                console.log(vm.dicClientName);
                //var lookups = datacontext.lookup.lookupCachedData;
                //vm.serverJob = {};
                //vm.job = {};
                //gotoJobStatus();
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




        function saveServiceType(entity) {
            var resourceUri = model.resourceUri.co + '/dictionary/servicetype/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                //vm.serverJob = {};
                //vm.job = {};
                //gotoJobStatus();
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
