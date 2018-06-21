(function () {
    'use strict';
    var controllerId = 'NonPersoJobIN';
    angular
        .module('app')
        .controller('NonPersoJobIN', NonPersoJobIN);

    NonPersoJobIN.$inject = ['$location', 'common', 'datacontext'];

    function NonPersoJobIN($location, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
       
        vm.getNonPersojobs = [];
        vm.addNewJob = addNewJob;

        activate();

        function activate() {
            var promises = [getNonPersojobs(), getRMUsers()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getNonPersojobs(forceRefresh) {
            return datacontext.rm.getNonPersojobs(forceRefresh).then(function (data) {
                vm.nonpersojobs = data;
                console.log(vm.nonpersojobs);
                return vm.nonpersojobs;
            });
        }

        function getRMUsers(forceRefresh) {
            return datacontext.rm.getRMUsers(forceRefresh).then(function (data) {
                vm.users = data;
                console.log(vm.users);
                return vm.users;
            });
        }

        function addNewJob() {
            $location.path('/rm/clients')
        }

        function goBack() { $window.history.back(); }

    
    }
})();
