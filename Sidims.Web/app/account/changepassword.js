(function () {
    'use strict';
    var controllerId = 'ChangePassword';
    angular
        .module('app')
        .controller('ChangePassword', ChangePassword);

    ChangePassword.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function ChangePassword($location, $routeParams, $scope, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.roles = [];
        vm.save = save;
        $scope.message = "";
        vm.message = "";
        vm.messageVisble = false;

        activate();

        function activate() {
            initLookups();
          
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated JobDetails View'); });
        }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            vm.roles = lookups.roles;
        }
    

        function goBack() { $window.history.back(); }

        function save() {

            vm.newEntity = {
                oldPassword: vm.user.currentPassWord,
                newPassword: vm.user.newPassword,
                confirmPassword: vm.user.confirmPassword,
            };

            createEntity(vm.newEntity);
        }

        function createEntity(entity) {
            var resourceUri = model.resourceUri.accounts + '/ChangePassword';
            resourceService.saveResource(resourceUri, entity).then(function (response) {                
                $scope.message = "";
                vm.isSaving = true;
                vm.message = "Please wait...";
                vm.messageVisble = true;

                $location.path('/')
            },
			 function (response) {
			     vm.isSaving = false;
			     vm.message = "";
			     vm.messageVisble = false;
			     //$scope.message = err.error_description;


			     var errors = [];
			     for (var key in response.data.modelState) {
			         for (var i = 0; i < response.data.modelState[key].length; i++) {
			             errors.push(response.data.modelState[key][i]);
			         }
			     }
			     $scope.message = "Failed to register user due to:" + errors.join(' ');


			 });
        }

        function createUserRole(entity, oldEntity) {
            var roleEntity = [oldEntity.roleName];
            createRoleAssignEntity(entity.id, roleEntity);
        }

        function createRoleAssignEntity(userId, roleEntity) {
            var resourceUri = model.resourceUri.accounts + '/user/' + userId + '/roles';
            resourceService.updateResourcePartial(resourceUri, roleEntity).then(function (response) {
                vm.user = {};
              
            };
        }





        function getJobs(forceRefresh) {
            return datacontext.resourcejob.getJobs(forceRefresh).then(function (data) {
                vm.jobs = data;
           
                vm.cardsetup = {
                    cardType: vm.jobTracker.job.sidCardType.name
                };

                getProductList(vm.jobTracker.job.sidClientId, vm.jobTracker.job.sidCardType.id);

                return vm.jobs;
            });
        }

        function getProductList(clientId, cardTypeId) {
            angular.forEach(vm.products, function (todo, key) {
                if (todo.sidCardTypeId == cardTypeId && todo.sidClientId == clientId) {
                    vm.newProducts.push(todo);
                }
            });
        }


    }


})();
