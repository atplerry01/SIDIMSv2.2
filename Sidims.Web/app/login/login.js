(function () {
    'use strict';
    var controllerId = 'login';

    angular
        .module('app')
        .controller('login', login);

    login.$inject = ['$layout', '$location', '$scope', '$rootScope', '$route', '$window', 'accountService', 'authService', 'common', 'localStorageService'];

    function login($layout, $location, $scope, $rootScope, $route, $window, accountService, authService, common, localStorageService) {
        /* jshint validthis:true */
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var $q = common.$q;
        var primePromise;

        var vm = this;

        vm.isSaving = false;
        vm.message = "";
        vm.messageVisble = false;
        vm.login = login;
        vm.clearErrorMessage = clearErrorMessage;

        $scope.showParticles = true;

        $scope.loginData = {
            userName: "",
            password: ""
        };

        $scope.message = "";

        Object.defineProperty(vm, 'canSave', { get: canSave });

        function canSave() { return !vm.isSaving; }

        function clearErrorMessage() {
            $scope.message = "";
        }

        function activate() {
            common.activateController([], controllerId)
                .then(function () {
                    //log('Activated Login View');
                });
        }

        function login() {
            $scope.message = "";
            vm.isSaving = true;
            vm.message = "Please wait...";
            vm.messageVisble = true;

            authService.login($scope.loginData).then(function (response) {
                $location.path('/');
                $window.location.reload();
            },
			 function (err) {
			     //console.log(err);
			     vm.isSaving = false;
			     vm.message = "";
			     vm.messageVisble = false;
			     $scope.message = err.error_description;
			     //console.log(err.error_description);
			 });
        }


        $scope.login = function () {

            $rootScope.isLoginPage = false;
            $rootScope.isLightLoginPage = false;
            $rootScope.isLockscreenPage = false;
            $rootScope.isMainPage = true;
            $rootScope.isContent = true;
            $rootScope.layoutOptions = {
                horizontalMenu: {
                    isVisible: false,
                    isFixed: true,
                    minimal: false,
                    clickToExpand: false,

                    isMenuOpenMobile: false
                },
                sidebar: {
                    isVisible: true,
                    isCollapsed: false,
                    toggleOthers: true,
                    isFixed: true,
                    isRight: false,

                    isMenuOpenMobile: false,

                    // Added in v1.3
                    userProfile: true
                },
                chat: {
                    isOpen: false,
                },
                settingsPane: {
                    isOpen: false,
                    useAnimation: true
                },
                container: {
                    isBoxed: false
                },
                skins: {
                    sidebarMenu: '',
                    horizontalMenu: '',
                    userInfoNavbar: ''
                },
                pageTitles: true,
                userInfoNavVisible: false
            };

            $layout.loadOptionsFromCookies(); // remove this line if you don't want to support cookies that remember layout changes
            //$location.path('/');

            authService.login($scope.loginData).then(function (response) {
              
                accountTypeSetup();
                defaultAccountType();

                $location.path('/');
            },
			 function (err) {
			     $scope.message = err.error_description;
			     //console.log($scope.message);
			 });

        }

        $rootScope.isLoginPage = true;
        $rootScope.isLightLoginPage = true;
        $rootScope.isLockscreenPage = false;
        $rootScope.isMainPage = false;

        $rootScope.layoutOptions = {
            horizontalMenu: {
                isVisible: false,
                isFixed: true,
                minimal: false,
                clickToExpand: false,

                isMenuOpenMobile: false
            },
            sidebar: {
                isVisible: false,
                isCollapsed: false,
                toggleOthers: false,
                isFixed: true,
                isRight: false,

                isMenuOpenMobile: false,

                // Added in v1.3
                userProfile: false
            },
            chat: {
                isOpen: false,
            },
            settingsPane: {
                isOpen: false,
                useAnimation: false
            },
            container: {
                isBoxed: false
            },
            skins: {
                sidebarMenu: '',
                horizontalMenu: '',
                userInfoNavbar: ''
            },
            pageTitles: false,
            userInfoNavVisible: false
        };


    }
})();
