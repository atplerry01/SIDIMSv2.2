(function () {
    'use strict';
    var controllerId = 'MISVaultReportsIN';
    angular
        .module('app')
        .controller('MISVaultReportsIN', MISVaultReportsIN);

    MISVaultReportsIN.$inject = ['$location', '$routeParams', 'common', 'config', 'datacontext'];

    function MISVaultReportsIN($location, $routeParams, common, config, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;

        vm.vaultrepots = [];

        activate();

        function activate() {
            var promises = [getVaultReports()];
            common.activateController(promises, controllerId)
                .then(function () {
                    log('Activated Jobs View');
                });
        }

        function getVaultReports(forceRefresh) {
            return datacontext.inventory.AllClientVaultReports(forceRefresh).then(function (data) {
                vm.vaultrepots = data;
                //console.log(vm.vaultrepots);
                return vm.vaultrepots;
            });
        }
     


        
    }
})();
