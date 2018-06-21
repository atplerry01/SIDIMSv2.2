(function () {
    'use strict';
    var controllerId = 'CreateClientUserSA';
    angular
        .module('app')
        .controller('CreateClientUserSA', CreateClientUserSA);

    CreateClientUserSA.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function CreateClientUserSA($location, $routeParams, $scope, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.roles = [];
        vm.save = save;

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
                firstName: vm.user.firstName,
                lastName: vm.user.lastName,
                email: vm.user.email,
                phoneNumber: vm.user.phoneNumber,
                userName: vm.user.userName,
                password: vm.user.password,
                confirmPassword: vm.user.confirmPassword,
                sidClientId: $routeParams.clientId
            };
            createEntity(vm.newEntity);
        }

        function createEntity(entity) {
            var resourceUri = model.resourceUri.accounts + '/client/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                $location.path('sa/client/' + $routeParams.clientId + '/userlist');
            },
			 function (response) {
			     //console.log(response);
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
            },
			 function (response) {
			     //console.log(response);
			 });
        }





        function getJobs(forceRefresh) {
            return datacontext.resourcejob.getJobs(forceRefresh).then(function (data) {
                vm.jobs = data;
                //console.log(vm.jobs);
                //console.log(vm.jobTracker.job);

                // setups all requested items
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
