﻿(function () {
    'use strict';
    var controllerId = 'CardProductListRM';
    angular
        .module('app')
        .controller('CardProductListRM', CardProductListRM);

    CardProductListRM.$inject = ['$location', '$routeParams', 'common', 'config', 'datacontext'];

    function CardProductListRM($location, $routeParams, common, config, datacontext) {
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
            var val = $routeParams.id; //
            return datacontext.inventory.getClientProducts2(val, forceRefresh)
                .then(function (data) {
                    vm.products = data;
                    //console.log(vm.products);
                    return data;
                });
        }

        function gotoclientProductDetails(entity) {
            //console.log($routeParams);

            var clientId = $routeParams.id;
            var productId = $routeParams.productId;

            if (entity && entity.id) {
                $location.path('/rm/client/' + clientId + '/product/' + entity.id + '/create')
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