(function () {
    'use strict';
    var controllerId = 'ClientListSA';
    angular
        .module('app')
        .controller('ClientListSA', ClientListSA);

    ClientListSA.$inject = ['$location', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function ClientListSA($location, $scope, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.clients = [];

        vm.gotoAccountDetails = gotoAccountDetails;

        activate();

        function activate() {

            var promises = [getClients()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getClients(forceRefresh) {
            return datacontext.inventory.getClients(forceRefresh).then(function (data) {
                vm.clients = data;
                //console.log(vm.clients);
                return vm.clients;
            });
        }

   
        function goBack() { $window.history.back(); }

        function gotoAccountDetails(entity) {
            if (entity && entity.id) {
                $location.path('/sa/client/' + entity.id + '/userlist');
            }
        }

    }
})();
