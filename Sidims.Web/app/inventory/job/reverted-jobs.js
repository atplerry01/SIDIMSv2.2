(function () {
    'use strict';
    var controllerId = 'IncomingHeldCardIN';
    angular
        .module('app')
        .controller('IncomingHeldCardIN', IncomingHeldCardIN);

    IncomingHeldCardIN.$inject = ['$location', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function IncomingHeldCardIN($location, $scope, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.confirmHeld = confirmHeld;
        vm.heldcards = [];

        activate();

        function activate() {
            initLookups();
            var promises = [getHeldCards(), getJobs(), getJobTrackers(), getProductionUsers()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            vm.departments = lookups.departments;
        }

        function getHeldCards(forceRefresh) {
            return datacontext.inventjob.getIncomingHeldCards(forceRefresh).then(function (data) {
                vm.heldcards = data;
                console.log(vm.heldcards);
                return vm.heldcards;
            });
        }

        function getJobs(forceRefresh) {
            return datacontext.inventjob.getJobs(forceRefresh).then(function (data) {
                vm.jobs = data;
                return vm.jobs;
            });
        }

        function getJobTrackers(forceRefresh) {
            return datacontext.resourcejob.getJobTrackers(forceRefresh).then(function (data) {
                vm.jobs = data;
                return vm.jobs;
            });
        }


        function gotoJobDetails(entity) {
            if (entity && entity.id) {

                console.log(entity);
                //$location.path('/in/held-card/' + entity.id)
            }
        }


        function confirmHeld(entity) {
            var newEntity = {
                id: entity.id,
            };

            createEntity(newEntity);
        }

        function createEntity(entity) {
            var resourceUri = model.resourceUri.inventory + '/heldcard-receipt/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                console.log(response);
                getHeldCards();               
            },
			 function (response) {
			     console.log(response);
			     $scope.message = "Failed to save resource due to:" + response;
			 });
        }

        function goBack() { $window.history.back(); }

        function getProductionUsers(forceRefresh) {
            return datacontext.inventaccount.getProductionStaffs(forceRefresh).then(function (data) {
                vm.users = data;
                console.log(vm.users);
                return vm.users;
            });
        }

    }
})();
