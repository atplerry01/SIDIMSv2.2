(function () {
    'use strict';

    var app = angular.module('app');

    app.controller('LoginCtrl', function ($layout, $location, $scope, $rootScope, accountService, authService, localStorageService) {

        $scope.loginData = {
            userName: "",
            password: ""
        };

        function accountTypeSetup() {
            //Todo
            var resUri = 'api/claims/AccountType'
            accountService.getAllAccount(resUri).then(function (results) {
                var accountType = results.data;
                $scope.accType = [];

                // Compile all the AccountType to a list
                angular.forEach(accountType, function (entity) {
                    $scope.accType.push(entity);
                });

                // Create the LS Data
                localStorageService.set('userAppAccountType', {
                    accountType: $scope.accType
                });

            }, function (error) {
                //console.log('Error from Resource' + error.data.message);
            });
        }

        function defaultAccountType() {
            //Todo
            var resUri = 'api/claims/DefaultAccountType'
            accountService.getAllAccount(resUri).then(function (results) {
                var accountType = results.data;
                $scope.accType = [];

                // Create the LS Data
                localStorageService.set('defaultUserAppAccountType', {
                    accountType: accountType
                });

            }, function (error) {
                //console.log('Error from Resource' + error.data.message);
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
                //console.log(response);

                // Get the users roles and claims information

                // Create the users AccountType Claims Service
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
        $rootScope.isLightLoginPage = false;
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


    });

    app.controller('LoginLightCtrl', function ($scope, $rootScope) {
        $rootScope.isLoginPage = true;
        $rootScope.isLightLoginPage = true;
        $rootScope.isLockscreenPage = false;
        $rootScope.isMainPage = false;
    });

    app.controller('LockscreenCtrl', function ($scope, $rootScope) {
        $rootScope.isLoginPage = false;
        $rootScope.isLightLoginPage = false;
        $rootScope.isLockscreenPage = true;
        $rootScope.isMainPage = false;
    });

    app.controller('MainCtrl2', function ($scope, $rootScope, $location, $layout, $layoutToggles, $pageLoadingBar, Fullscreen) {

        $rootScope.isLoginPage = false;
        $rootScope.isLightLoginPage = false;
        $rootScope.isLockscreenPage = false;
        $rootScope.isMainPage = true;

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


        $scope.updatePsScrollbars = function () {
            var $scrollbars = jQuery(".ps-scrollbar:visible");

            $scrollbars.each(function (i, el) {
                if (typeof jQuery(el).data('perfectScrollbar') == 'undefined') {
                    jQuery(el).perfectScrollbar();
                }
                else {
                    jQuery(el).perfectScrollbar('update');
                }
            })
        };


        // Define Public Vars
        public_vars.$body = jQuery("body");


        // Init Layout Toggles
        $layoutToggles.initToggles();


        // Other methods
        $scope.setFocusOnSearchField = function () {
            public_vars.$body.find('.search-form input[name="s"]').focus();

            setTimeout(function () { public_vars.$body.find('.search-form input[name="s"]').focus() }, 100);
        };


        // Watch changes to replace checkboxes
        $scope.$watch(function () {
            cbr_replace();
        });

        // Watch sidebar status to remove the psScrollbar
        $rootScope.$watch('layoutOptions.sidebar.isCollapsed', function (newValue, oldValue) {
            if (newValue != oldValue) {
                if (newValue == true) {
                    public_vars.$sidebarMenu.find('.sidebar-menu-inner').perfectScrollbar('destroy')
                }
                else {
                    public_vars.$sidebarMenu.find('.sidebar-menu-inner').perfectScrollbar({ wheelPropagation: public_vars.wheelPropagation });
                }
            }
        });


        // Page Loading Progress (remove/comment this line to disable it)
        $pageLoadingBar.init();

        $scope.showLoadingBar = showLoadingBar;
        $scope.hideLoadingBar = hideLoadingBar;


        // Set Scroll to 0 When page is changed
        $rootScope.$on('$routeChangeStart', function () {
            var obj = { pos: jQuery(window).scrollTop() };

            TweenLite.to(obj, .25, {
                pos: 0, ease: Power4.easeOut, onUpdate: function () {
                    $(window).scrollTop(obj.pos);
                }
            });
        });


        // Full screen feature added in v1.3
        $scope.isFullscreenSupported = Fullscreen.isSupported();
        $scope.isFullscreen = Fullscreen.isEnabled() ? true : false;

        $scope.goFullscreen = function () {
            if (Fullscreen.isEnabled())
                Fullscreen.cancel();
            else
                Fullscreen.all();

            $scope.isFullscreen = Fullscreen.isEnabled() ? true : false;
        }


    });

    //
    app.controller('SidebarMenuCtrl', function ($scope, $route, $rootScope, $menuItems, $timeout, $location, $layout, localStorageService) {

        // Readout the AccountType
        var defaultClaimData = localStorageService.get('defaultUserAppAccountType');
        $scope.defaultClaimData = [];

        // Read the data into a scope
        if (defaultClaimData) {
            $scope.defaultClaimData = defaultClaimData.accountType[0];
        }

        // Menu Items
        var $sidebarMenuItems = $menuItems.instantiate();

        $scope.menuItems = $sidebarMenuItems.prepareSidebarMenu().getAll();

        // Set Active Menu Item
        $sidebarMenuItems.setActive($location.path());

        $rootScope.$on('$routeChangeSuccess', function () {
            $sidebarMenuItems.setActive($route.current.originalPath);
        });

        // Trigger menu setup
        public_vars.$sidebarMenu = public_vars.$body.find('.sidebar-menu');
        $timeout(setup_sidebar_menu, 1);

        ps_init(); // perfect scrollbar for sidebar
    });

    app.controller('HorizontalMenuCtrl', function ($scope, $rootScope, $menuItems, $timeout, $location, $state) {

        var $horizontalMenuItems = $menuItems.instantiate();

        $scope.menuItems = $horizontalMenuItems.prepareHorizontalMenu().getAll();

        // Set Active Menu Item
        $horizontalMenuItems.setActive($location.path());

        $rootScope.$on('$stateChangeSuccess', function () {
            $horizontalMenuItems.setActive($state.current.name);

            $(".navbar.horizontal-menu .navbar-nav .hover").removeClass('hover'); // Close Submenus when item is selected
        });

        // Trigger menu setup
        $timeout(setup_horizontal_menu, 1);

    });

    //
    app.controller('SettingsPaneCtrl', function ($rootScope) {
        // Define Settings Pane Public Variable
        public_vars.$settingsPane = public_vars.$body.find('.settings-pane');
        public_vars.$settingsPaneIn = public_vars.$settingsPane.find('.settings-pane-inner');

    });

    app.controller('ChatCtrl', function ($scope, $element) {
        var $chat = jQuery($element),
			$chat_conv = $chat.find('.chat-conversation');

        $chat.find('.chat-inner').perfectScrollbar(); // perfect scrollbar for chat container


        // Chat Conversation Window (sample)
        $chat.on('click', '.chat-group a', function (ev) {
            ev.preventDefault();

            $chat_conv.toggleClass('is-open');

            if ($chat_conv.is(':visible')) {
                $chat.find('.chat-inner').perfectScrollbar('update');
                $chat_conv.find('textarea').autosize();
            }
        });

        $chat_conv.on('click', '.conversation-close', function (ev) {
            ev.preventDefault();

            $chat_conv.removeClass('is-open');
        });
    });

    app.controller('UIModalsCtrl', function ($scope, $rootScope, $modal, $sce) {
        // Open Simple Modal
        $scope.openModal = function (modal_id, modal_size, modal_backdrop) {
            $rootScope.currentModal = $modal.open({
                templateUrl: modal_id,
                size: modal_size,
                backdrop: typeof modal_backdrop == 'undefined' ? true : modal_backdrop
            });
        };

        // Loading AJAX Content
        $scope.openAjaxModal = function (modal_id, url_location) {
            $rootScope.currentModal = $modal.open({
                templateUrl: modal_id,
                resolve: {
                    ajaxContent: function ($http) {
                        return $http.get(url_location).then(function (response) {
                            $rootScope.modalContent = $sce.trustAsHtml(response.data);
                        }, function (response) {
                            $rootScope.modalContent = $sce.trustAsHtml('<div class="label label-danger">Cannot load ajax content! Please check the given url.</div>');
                        });
                    }
                }
            });

            $rootScope.modalContent = $sce.trustAsHtml('Modal content is loading...');
        }

    });

    app.controller('SettingsPaneCtrl', function ($scope) {
        $scope.totalItems = 64;
        $scope.currentPage = 4;

        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.pageChanged = function () {
            //console.log('Page changed to: ' + $scope.currentPage);
        };

        $scope.maxSize = 5;
        $scope.bigTotalItems = 175;
        $scope.bigCurrentPage = 1;

    });

    app.controller('LayoutVariantsCtrl', function ($scope, $layout, $cookies) {

        $scope.opts = {
            sidebarType: null,
            fixedSidebar: null,
            sidebarToggleOthers: null,
            sidebarVisible: null,
            sidebarPosition: null,

            horizontalVisible: null,
            fixedHorizontalMenu: null,
            horizontalOpenOnClick: null,
            minimalHorizontalMenu: null,

            sidebarProfile: null
        };

        $scope.sidebarTypes = [
			{ value: ['sidebar.isCollapsed', false], text: 'Expanded', selected: $layout.is('sidebar.isCollapsed', false) },
			{ value: ['sidebar.isCollapsed', true], text: 'Collapsed', selected: $layout.is('sidebar.isCollapsed', true) },
        ];

        $scope.fixedSidebar = [
			{ value: ['sidebar.isFixed', true], text: 'Fixed', selected: $layout.is('sidebar.isFixed', true) },
			{ value: ['sidebar.isFixed', false], text: 'Static', selected: $layout.is('sidebar.isFixed', false) },
        ];

        $scope.sidebarToggleOthers = [
			{ value: ['sidebar.toggleOthers', true], text: 'Yes', selected: $layout.is('sidebar.toggleOthers', true) },
			{ value: ['sidebar.toggleOthers', false], text: 'No', selected: $layout.is('sidebar.toggleOthers', false) },
        ];

        $scope.sidebarVisible = [
			{ value: ['sidebar.isVisible', true], text: 'Visible', selected: $layout.is('sidebar.isVisible', true) },
			{ value: ['sidebar.isVisible', false], text: 'Hidden', selected: $layout.is('sidebar.isVisible', false) },
        ];

        $scope.sidebarPosition = [
			{ value: ['sidebar.isRight', false], text: 'Left', selected: $layout.is('sidebar.isRight', false) },
			{ value: ['sidebar.isRight', true], text: 'Right', selected: $layout.is('sidebar.isRight', true) },
        ];

        $scope.horizontalVisible = [
			{ value: ['horizontalMenu.isVisible', true], text: 'Visible', selected: $layout.is('horizontalMenu.isVisible', true) },
			{ value: ['horizontalMenu.isVisible', false], text: 'Hidden', selected: $layout.is('horizontalMenu.isVisible', false) },
        ];

        $scope.fixedHorizontalMenu = [
			{ value: ['horizontalMenu.isFixed', true], text: 'Fixed', selected: $layout.is('horizontalMenu.isFixed', true) },
			{ value: ['horizontalMenu.isFixed', false], text: 'Static', selected: $layout.is('horizontalMenu.isFixed', false) },
        ];

        $scope.horizontalOpenOnClick = [
			{ value: ['horizontalMenu.clickToExpand', false], text: 'No', selected: $layout.is('horizontalMenu.clickToExpand', false) },
			{ value: ['horizontalMenu.clickToExpand', true], text: 'Yes', selected: $layout.is('horizontalMenu.clickToExpand', true) },
        ];

        $scope.minimalHorizontalMenu = [
			{ value: ['horizontalMenu.minimal', false], text: 'No', selected: $layout.is('horizontalMenu.minimal', false) },
			{ value: ['horizontalMenu.minimal', true], text: 'Yes', selected: $layout.is('horizontalMenu.minimal', true) },
        ];

        $scope.chatVisibility = [
			{ value: ['chat.isOpen', false], text: 'No', selected: $layout.is('chat.isOpen', false) },
			{ value: ['chat.isOpen', true], text: 'Yes', selected: $layout.is('chat.isOpen', true) },
        ];

        $scope.boxedContainer = [
			{ value: ['container.isBoxed', false], text: 'No', selected: $layout.is('container.isBoxed', false) },
			{ value: ['container.isBoxed', true], text: 'Yes', selected: $layout.is('container.isBoxed', true) },
        ];

        $scope.sidebarProfile = [
			{ value: ['sidebar.userProfile', false], text: 'No', selected: $layout.is('sidebar.userProfile', false) },
			{ value: ['sidebar.userProfile', true], text: 'Yes', selected: $layout.is('sidebar.userProfile', true) },
        ];

        $scope.resetOptions = function () {
            $layout.resetCookies();
            window.location.reload();
        };

        var setValue = function (val) {
            if (val != null) {
                val = eval(val);
                $layout.setOptions(val[0], val[1]);
            }
        };

        $scope.$watch('opts.sidebarType', setValue);
        $scope.$watch('opts.fixedSidebar', setValue);
        $scope.$watch('opts.sidebarToggleOthers', setValue);
        $scope.$watch('opts.sidebarVisible', setValue);
        $scope.$watch('opts.sidebarPosition', setValue);

        $scope.$watch('opts.horizontalVisible', setValue);
        $scope.$watch('opts.fixedHorizontalMenu', setValue);
        $scope.$watch('opts.horizontalOpenOnClick', setValue);
        $scope.$watch('opts.minimalHorizontalMenu', setValue);

        $scope.$watch('opts.chatVisibility', setValue);

        $scope.$watch('opts.boxedContainer', setValue);

        $scope.$watch('opts.sidebarProfile', setValue);

    });

    app.controller('ThemeSkinsCtrl', function ($scope, $layout) {
        var $body = jQuery("body");

        $scope.opts = {
            sidebarSkin: $layout.get('skins.sidebarMenu'),
            horizontalMenuSkin: $layout.get('skins.horizontalMenu'),
            userInfoNavbarSkin: $layout.get('skins.userInfoNavbar')
        };

        $scope.skins = [
			{ value: '', name: 'Default', palette: ['#2c2e2f', '#EEEEEE', '#FFFFFF', '#68b828', '#27292a', '#323435'] },
			{ value: 'aero', name: 'Aero', palette: ['#558C89', '#ECECEA', '#FFFFFF', '#5F9A97', '#558C89', '#255E5b'] },
			{ value: 'navy', name: 'Navy', palette: ['#2c3e50', '#a7bfd6', '#FFFFFF', '#34495e', '#2c3e50', '#ff4e50'] },
			{ value: 'facebook', name: 'Facebook', palette: ['#3b5998', '#8b9dc3', '#FFFFFF', '#4160a0', '#3b5998', '#8b9dc3'] },
			{ value: 'turquoise', name: 'Truquoise', palette: ['#16a085', '#96ead9', '#FFFFFF', '#1daf92', '#16a085', '#0f7e68'] },
			{ value: 'lime', name: 'Lime', palette: ['#8cc657', '#ffffff', '#FFFFFF', '#95cd62', '#8cc657', '#70a93c'] },
			{ value: 'green', name: 'Green', palette: ['#27ae60', '#a2f9c7', '#FFFFFF', '#2fbd6b', '#27ae60', '#1c954f'] },
			{ value: 'purple', name: 'Purple', palette: ['#795b95', '#c2afd4', '#FFFFFF', '#795b95', '#27ae60', '#5f3d7e'] },
			{ value: 'white', name: 'White', palette: ['#FFFFFF', '#666666', '#95cd62', '#EEEEEE', '#95cd62', '#555555'] },
			{ value: 'concrete', name: 'Concrete', palette: ['#a8aba2', '#666666', '#a40f37', '#b8bbb3', '#a40f37', '#323232'] },
			{ value: 'watermelon', name: 'Watermelon', palette: ['#b63131', '#f7b2b2', '#FFFFFF', '#c03737', '#b63131', '#32932e'] },
			{ value: 'lemonade', name: 'Lemonade', palette: ['#f5c150', '#ffeec9', '#FFFFFF', '#ffcf67', '#f5c150', '#d9a940'] },
        ];

        $scope.$watch('opts.sidebarSkin', function (val) {
            if (val != null) {
                $layout.setOptions('skins.sidebarMenu', val);

                $body.attr('class', $body.attr('class').replace(/\sskin-[a-z]+/)).addClass('skin-' + val);
            }
        });

        $scope.$watch('opts.horizontalMenuSkin', function (val) {
            if (val != null) {
                $layout.setOptions('skins.horizontalMenu', val);

                $body.attr('class', $body.attr('class').replace(/\shorizontal-menu-skin-[a-z]+/)).addClass('horizontal-menu-skin-' + val);
            }
        });

        $scope.$watch('opts.userInfoNavbarSkin', function (val) {
            if (val != null) {
                $layout.setOptions('skins.userInfoNavbar', val);

                $body.attr('class', $body.attr('class').replace(/\suser-info-navbar-skin-[a-z]+/)).addClass('user-info-navbar-skin-' + val);
            }
        });

    });

    app.controller('FooterChatCtrl', function ($scope, $element) {
        $scope.isConversationVisible = false;

        $scope.toggleChatConversation = function () {
            $scope.isConversationVisible = !$scope.isConversationVisible;

            if ($scope.isConversationVisible) {
                setTimeout(function () {
                    var $el = $element.find('.ps-scrollbar');

                    if ($el.hasClass('ps-scroll-down')) {
                        $el.scrollTop($el.prop('scrollHeight'));
                    }

                    $el.perfectScrollbar({
                        wheelPropagation: false
                    });

                    $element.find('.form-control').focus();

                }, 300);
            }
        }
    });

    app.controller('UserInfoNavCtrl', function ($location, $rootScope, $scope, $window, authService, localStorageService) {

        //// Get Users Messages

        //// Get Users Notifications

        //// Get Users Claims Roles
        //// Todo Now
        //var claimData = localStorageService.get('userAppAccountType');
        //var defaultClaimData = localStorageService.get('defaultUserAppAccountType');

        //$scope.claimData = [];

        //// Read the data into a scope
        //if (claimData) {
        //    $scope.claimData = claimData.accountType;
        //}

        //if (defaultClaimData) {
        //    $scope.defaultClaimData = defaultClaimData.accountType[0];
        //}

        //// Switch the claims data
        //$scope.switchClaim = function (entity) {
        //    // Update the value inside the LS DefaultAccountType
        //    // get the LS Data
        //    var defaultClaimData = localStorageService.get('defaultUserAppAccountType');

        //    $scope.tmpClaims = defaultClaimData.accountType;
        //    $scope.tmpClaims[0].value = entity.value; // Replace with selected value

        //    // Push back to the LS
        //    localStorageService.set('defaultUserAppAccountType', {
        //        accountType: $scope.tmpClaims
        //    });

        //    // Reload the refresh the page view
        //    $window.location.reload(true);

        //}





        $scope.logOut = function () {
            // Removed the LS Storage Data
            //localStorageService.remove('userAppAccountType');

            authService.logOut();
            $location.path('/login'); // Todo: Replace with a general Home
        }


    });


})();
