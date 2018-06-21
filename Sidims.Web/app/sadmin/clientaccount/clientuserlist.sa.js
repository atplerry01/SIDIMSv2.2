(function () {
    'use strict';
    var controllerId = 'ClientUserListSA';
    angular
        .module('app')
        .controller('ClientUserListSA', ClientUserListSA);

    ClientUserListSA.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function ClientUserListSA($location, $routeParams, $scope, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.clientUsers = [];

        vm.gotoAccountCreate = gotoAccountCreate;

        activate();

        function activate() {
            var promises = [getClients(), getUsers()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getClients(forceRefresh) {
            var clientId = $routeParams.clientId;
            //console.log(clientId);
            return datacontext.inventory.getClientUsers(clientId, forceRefresh).then(function (data) {
                vm.clientUsers = data;
                //console.log(vm.clientUsers);
                return vm.clientUsers;
            });
        }

        function getUsers(forceRefresh) {
            var clientId = $routeParams.clientId;
            return datacontext.inventory.getSelectedClientUsers(clientId, forceRefresh).then(function (data) {
                vm.users = data;
                //console.log(vm.users);
                return vm.users;
            });
        }

        function goBack() { $window.history.back(); }

        function gotoAccountCreate() {
            $location.path('/sa/client/' + $routeParams.clientId + '/create/new');
        }

    }
})();
