(function () {
    'use strict';
    var controllerId = 'VaultUpdateIN';
    angular
        .module('app')
        .controller('VaultUpdateIN', VaultUpdateIN);

    VaultUpdateIN.$inject = ['$location', '$routeParams', 'common', 'config', 'datacontext', 'model', 'resourceService'];

    function VaultUpdateIN($location, $routeParams, common, config, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;

        vm.save = save;

        activate();

        function activate() {
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function () {
                    log('Activated Jobs View');
                });
        }


        function save() {
            var val = $routeParams.productId;

            vm.newEntity = {
                sidProductId: val,
                quantity: vm.issuance.quantity
            };

            ////console.log(vm.newEntity);
            createProductVault(vm.newEntity);
        }

        function createProductVault(entity) {
         
            var resourceUri = model.resourceUri.inventory + '/directcard/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                //console.log(response);
                $location.path('/in/mis/card/mis-reports')
                //getClientVaultReport();
                //vm.createVault = false;
            },
			 function (response) {
			     console.lo(response);
			     $scope.message = "Failed to save due to: "
                     + response.data.message;
			 });

        }


    }
})();
