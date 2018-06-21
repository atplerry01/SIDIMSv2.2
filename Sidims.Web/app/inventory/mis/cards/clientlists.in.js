(function () {
    'use strict';
    var controllerId = 'MISCardClientListIN';
    angular
        .module('app')
        .controller('MISCardClientListIN', MISCardClientListIN);

    MISCardClientListIN.$inject = ['$location', '$window', 'common', 'datacontext'];

    function MISCardClientListIN($location, $window, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.clients = [];
        vm.gotoProducts = gotoProducts;
        vm.updateClient = updateClient;
        vm.newClient = newClient;

        activate();

        function activate() {
            var promises = [getClients()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }
        
        function getClients(forceRefresh) {
            return datacontext.inventory.getClients(forceRefresh).then(function (data) {
                vm.clients = data;
                return vm.clients;
            });
        }

        function updateClient(entity) {
            $location.path('/in/mis/client/' + entity.id);
        }


        function newClient() {
            $location.path('/in/mis/client/new');
        }

        function gotoProducts(entity) {
            $location.path('/in/mis/card/client/' + entity.id + '/products')
        }

        function goBack() { $window.history.back(); }

    
    }
})();
