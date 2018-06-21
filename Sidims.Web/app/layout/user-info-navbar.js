(function () {
    'use strict';
    var controllerId = 'login';

    angular
        .module('app')
        .controller('userInfoNavBar', userInfoNavBar);

    userInfoNavBar.$inject = ['$location', '$route', '$scope', '$window', 'authService', 'common', 'config', 'localStorageService', 'ngAuthSettings'];

    function userInfoNavBar($location, $route, $scope, $window, authService, common, config, localStorageService, ngAuthSettings) {
        /* jshint validthis:true */
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var $q = common.$q;
        var vm = this;
        var keyCodes = config.keyCodes;

        var _authentication = {
            clientId: "",
            isAuth: false,
            userName: "",
            page: "",
            roles: "",
            fullName: ""
        };

        vm.search = search;
        vm.switchAccount = switchAccount;

        vm.auth = authService.authentication;
        vm.roles = [];

        $scope.logOut = function () {
            authService.logOut();
            $location.path('/login');
        }

        activate();

        function activate() {
            common.activateController([roleSetups()], controllerId)
                .then(function () {
                    //log('Activated Login View');
                });
        }

        // get the roles in form of arrays

        function setupRoles() {

        }
        function roleSetups() {

            if (vm.auth.fullName == undefined || vm.auth.fullName === '') {
                //console.log('empty');
                $route.reload();
            }

            if (vm.auth.roles) {
                //var roles = JSON.parse(vm.auth.roles);
                var roles = vm.auth.roles;
                angular.forEach(roles, function (todo) {
                    vm.roles.push({
                        name: todo
                    });
                });
            } else {
                $route.reload();
            }

        }

        function search($event) {
            //console.log('enter');
            if ($event.keyCode === keyCodes.esc) {
                vm.searchText = '';
                return;
            }

            if ($event.type === '' || $event.keyCode === keyCodes.enter) {
                //console.log('enter');
                var route = 'products/search/';
                $location.path(route + vm.searchText);
            }
        }

        function switchAccount(entity) {
            // get LS Data and get defaultPage out

            var authData = localStorageService.get('authorizationData');
            if (authData) {
                _authentication.isAuth = true;
                _authentication.userName = authData.userName;
                _authentication.clientId = ngAuthSettings.clientId;
                _authentication.page = authData.page;
                _authentication.roles = authData.roles;
                _authentication.fullName = authData.fullName;
            }

            //// set the LS
            localStorageService.set('authorizationData',
                       {
                           clientId: authData.clientId,
                           token: authData.token,
                           userName: authData.userName,
                           roles: authData.roles,
                           page: entity.name,
                           fullName: authData.fullName
                       });

            var authData2 = localStorageService.get('authorizationData');
          
            $window.location.reload();
            $location.path('/');
        }
    }
})();
