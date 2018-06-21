(function () {
    'use strict';
    var controllerId = 'MISUpdateProductImageIN';
    angular
        .module('app')
        .controller('MISUpdateProductImageIN', MISUpdateProductImageIN);

    MISUpdateProductImageIN.$inject = ['$location', '$routeParams', '$scope', '$window', 'common', 'datacontext', 'model', 'ngAuthSettings', 'resourceService', 'Upload'];

    function MISUpdateProductImageIN($location, $routeParams, $scope, $window, common, datacontext, model, ngAuthSettings, resourceService, Upload) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var serviceBase = ngAuthSettings.apiResourceBaseUri;

        vm.goBack = goBack;
        vm.selectedClientVariant = [];
        $scope.message = "";

        vm.cardTypes = [];
        vm.createVault = false;
        vm.productName = false;
        vm.card = {};
        vm.copyText = copyText;
        activate();

        // upload later on form submit or something similar
        $scope.submit = function () {
            //console.log('enter');
            if ($scope.file) {
                //console.log($scope.file);
                $scope.upload($scope.file);
            }
        };

        // upload on file select or drop
        $scope.upload = function (file) {
            Upload.upload({
                url: serviceBase + '/api/upload/image/' + $routeParams.productId,
                data: { file: file }
            }).then(function (resp) {
                getProductImage($routeParams.productId);
                //console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            }, function (resp) {
                //console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            });
        };

        function copyText() {
            //vm.product.name = '';
            var variant = '';
            if (vm.product.variant !== undefined) {
                variant = vm.product.variant;
            } else {
                variant = '';
            }
            vm.product.name = vm.client.shortCode + ' ' + vm.product.sidCardType.name + ' ' + variant;
        }

        function activate() {
            initLookups();
            var promises = [getRequestedProduct()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated X JobDetails View'); });
        }

        function initLookups(clientId) {
            var lookups = datacontext.lookup.lookupCachedData;
            vm.sidClients = lookups.clients;
            vm.cardTypes = lookups.sidCardTypes;

            //var clientId = $routeParams.clientId;
            angular.forEach(vm.sidClients, function (todo, key) {
                if (todo.id == clientId) {
                    vm.client = todo;
                    vm.card.clientName = todo.name;
                }
            });
        }

        function getRequestedProduct() {
            var val = $routeParams.productId;
            return datacontext.inventory.getProductById(val)
                .then(function (data) {
                    vm.product = data;
                    initLookups(vm.product.sidClientId);
                    getProductImage(vm.product.id);
                }, function (error) {
                    logError('Unable to get Product ' + val);
                });
        }

        function getProductImage(entity) {
            return datacontext.inventory.getProductImage(entity)
                .then(function (data) {
                    vm.productImage = data[0];
                    vm.productImagePath = serviceBase + 'uploads/' + vm.productImage.imageName;
                    //console.log(vm.productImagePath);
                }, function (error) {
                    logError('Unable to get JobTracker ' + val);
                });
        }

        function createEntity(entity) {
            var clientId = $routeParams.clientId;
            var resourceUri = model.resourceUri.inventory + '/sidproduct/update';
            resourceService.updateResource(resourceUri, entity).then(function (response) {
                //console.log(response);
                $location.path('in/mis/card/client/' + response.data.sidClientId + '/products')
            },
                function (response) {
                    //console.log(response);
			     $scope.message = "Failed to save due to: " + response.data.message;
			 });
        }

        function goBack() { $window.history.back(); }

    }


})();
