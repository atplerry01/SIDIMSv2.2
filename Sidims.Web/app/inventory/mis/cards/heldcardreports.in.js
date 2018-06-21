(function () {
    'use strict';
    var controllerId = 'MISHeldCardReportsIN';
    angular
        .module('app')
        .controller('MISHeldCardReportsIN', MISHeldCardReportsIN);

    MISHeldCardReportsIN.$inject = ['$location', '$routeParams', 'common', 'config', 'datacontext'];

    function MISHeldCardReportsIN($location, $routeParams, common, config, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;

        vm.gotoclientProductDetails = gotoclientProductDetails;

        vm.filteredProducts = [];
        vm.products = [];
        vm.productsSearch = '';
        vm.productsFilter = productsFilter;
        vm.search = search;

        vm.productCount = 0;
        vm.productFilteredCount = 0;
        vm.paging = {
            currentPage: 1,
            maxPagesToShow: 5,
            pageSize: 10
        };
        vm.pageChanged = pageChanged;

        Object.defineProperty(vm.paging, 'pageCount', {
            get: function () {
                return Math.floor(vm.productFilteredCount / vm.paging.pageSize) + 1;
            }
        });

        var applyFilter = function () { };

        activate();

        function activate() {
            
            var promises = [getProducts()];
            common.activateController(promises, controllerId)
                .then(function () {
                    applyFilter = common.createSearchThrottle(vm, 'products');
                    if (vm.productsSearch) { applyFilter(true); }
                    log('Activated Jobs View');
                });
        }

        function getProductCount() {
            return datacontext.inventory.getProductCount()
                .then(function (data) {
                    return vm.productCount = data;
                });
        }

        function getProductFilteredCount() {
            vm.productFilteredCount = datacontext.inventory.getProductFilteredCount(vm.productsSearch);
        }


        function getProducts(forceRefresh) {
            var val = $routeParams.clientId; //
            return datacontext.inventory.getClientProducts(val, forceRefresh,
                vm.paging.currentPage, vm.paging.pageSize, vm.productsSearch)
                .then(function (data) {
                    vm.products = vm.filteredProducts = data;
                    getProductFilteredCount();
                    if (!vm.productCount || forceRefresh) {
                        getProductCount();
                    }
                    return data;
            });
        }

        function gotoclientProductDetails(entity) {
            var clientId = $routeParams.clientId;

            //console.log('/in/mis/card/client/' + clientId + '/product/' + entity.id + '/joblists');

            if (entity && entity.id) {
                $location.path('/in/mis/card/client/' + clientId + '/product/' + entity.id + '/joblists')
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


        function search($event) {
            if ($event.keyCode === keyCodes.esc) {
                vm.productsSearch = '';
                applyFilter(true);
            } else {
                applyFilter();
            }
        }


        function applyFilter() {
            vm.filteredProducts = vm.products.filter(productsFilter);
        }

        function productsFilter(product) {
            var textContains = common.textContains;
            var searchText = vm.productsSearch;
            var isMatch = searchText ?
                textContains(product.name, searchText)
                    || textContains(product.name, searchText)
                    || textContains(product.name, searchText)
                    || textContains(product.name, searchText)
                    || textContains(product.name, searchText)
                : true;
            return isMatch;

        }
    
        function pageChanged(page) {
            if (!page) { return; }
            vm.paging.currentPage = page;
            getProducts();
        }
        
    }
})();
