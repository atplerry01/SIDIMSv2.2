(function () {
    'use strict';

    angular
        .module('app')
        .controller('pagetitle', PageTitle);

    PageTitle.$inject = ['$location', '$rootScope', '$scope', 'common', 'datacontext', 'routes'];

    function PageTitle($location, $rootScope, $scope, common, datacontext, routes) {
        /*jshint validthis: true */
        var vm = this;

        var logger = common.logger;

        vm.title = undefined;
        vm.title2 = undefined;
        $scope.name = "Olami";
    
        activate();

        function activate() {
            //getNavRoutes();
            getNavRoutes2();
            getNavRoutes3();
            //logger.success('CodeCamper loaded!', null);
        }

        function getNavRoutes() {
            $rootScope.$on('$routeChangeSuccess',
               function (event, current, previous) {
                   $scope.location = $location.path(); // '/Home'
                   angular.forEach(routes, function (todo) {
                       //console.log(todo.url);
                       if (todo.url == $scope.location) {
                           vm.title2 = todo.config.title;
                       }
                   });
               });
        }

        ///
        function getNavRoutes2() {
            $rootScope.$on('$routeChangeSuccess',
               function (event, current, previous) {

                   $scope.location = $location.path(); // '/Home'

                   var BreakException = {};
                   try {
                       routes.forEach(function (entity) {
                           
                           if (entity.url == $scope.location) {
                               vm.title = entity.config.title;
                           }

                           // Breakpoint;
                           if (entity === undefined) {
                               throw BreakException;
                           }

                       });
                   } catch (e) {
                       if (e !== BreakException) throw e;
                   }
               });
        }

        function getNavRoutes3() {
            $rootScope.$on('$routeChangeStart',
               function (event, current, previous) {

                   $scope.location = $location.path(); // '/Home'

                   var BreakException = {};
                   try {
                       routes.forEach(function (entity) {

                           if (entity.url == $scope.location) {
                               vm.title = entity.config.title;
                           }

                           // Breakpoint;
                           if (entity === undefined) {
                               throw BreakException;
                           }

                       });
                   } catch (e) {
                       if (e !== BreakException) throw e;
                   }
               });
        }

    }
})();