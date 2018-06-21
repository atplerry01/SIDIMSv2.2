(function () {
    'use strict';
    var controllerId = 'AccountDetailSA';
    angular
        .module('app')
        .controller('AccountDetailSA', AccountDetailSA);

    AccountDetailSA.$inject = ['$location', '$routeParams', '$route', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function AccountDetailSA($location, $routeParams, $route, $scope, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.assign = undefined;
        vm.roles = [];
        vm.removeRole = removeRole;
        vm.saveRole = saveRole;
        //vm.save = save;
        vm.userRoles = [];

        $scope.message = "";

        activate();

        function activate() {
            initLookups();

            var promises = [getRequestedAccount()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated JobDetails View'); });
        }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            vm.roles = lookups.roles;
        }

        function getRequestedAccount() {
            var val = $routeParams.id;
            return datacontext.sadminaccount.getById(val)
                .then(function (data) {
                    vm.user = data;
                    getUserRoles(vm.user.id);
                }, function (error) {
                    logError('Unable to get JobTracker ' + val);
                });
        }

        function goBack() { $window.history.back(); }

        function getUserRoles(userId, forceRefresh) {
            return datacontext.sadminaccount.getUserRoles(userId, forceRefresh).then(function (data) {
                vm.userRoles = data;
                return vm.userRoles;
            });
        }

        function removeRole(entity) {
            var newObject = [];
            angular.forEach(vm.userRoles, function (role, key) {
                if (entity.name !== role.name) {
                    newObject.push(role.name);
                }
            });

            createRoleAssignEntity(vm.user.id, newObject);
        }

        function saveRole() {
            var newObject = [];
            angular.forEach(vm.userRoles, function (role, key) {
                newObject.push(role.name);
            });

            newObject.push(vm.assign.role.name);
            createRoleAssignEntity(vm.user.id, newObject);
        }

        function createRoleAssignEntity(userId, roleEntity) {
            var resourceUri = model.resourceUri.accounts + '/user/' + userId + '/roles';
            resourceService.updateResourcePartial(resourceUri, roleEntity).then(function (response) {
                getRequestedAccount();
            },
			 function (response) {
			     ////console.log(response);
			 });
        }


    }


})();
