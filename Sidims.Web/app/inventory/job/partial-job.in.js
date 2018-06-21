(function () {
    'use strict';
    var controllerId = 'PartialJobIN';
    angular
        .module('app')
        .controller('PartialJobIN', PartialJobIN);

    PartialJobIN.$inject = ['$location', 'common', 'datacontext'];

    function PartialJobIN($location, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.gotoJobDetails = gotoJobDetails;
        vm.gotoCardLogDetails = gotoCardLogDetails;
        vm.partialJobs = [];

        activate();

        function activate() {
            var promises = [getPartialJobs(), getJobs(), getInventoryUsers()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        // Get CardIssuance
        function getPartialJobs(forceRefresh) {
            return datacontext.inventjob.getPartialJobs(forceRefresh).then(function (data) {
                vm.partialJobs = data;
                //console.log(vm.partialJobs);
                return vm.partialJobs;
            });
        }

        function getJobs(forceRefresh) {
            return datacontext.inventjob.getJobs(forceRefresh).then(function (data) {
                vm.jobs = data;
                return vm.jobs;
            });
        }





        function getInventoryUsers(forceRefresh) {
            return datacontext.inventaccount.getInventoryUsers(forceRefresh).then(function (data) {
                vm.invusers = data;
                //console.log(vm.invusers);
                return vm.invusers;
            });
        }

        function gotoCardLogDetails(entity) {
            if (entity && entity.id) {
                $location.path('/in/card-issuance-log/' + entity.id)
            }
        }

        function gotoJobDetails(entity) {
            if (entity && entity.id) {
                $location.path('/in/partial-issuance/' + entity.id)
            }
        }




        //////
        //function getIncomingJobs(forceRefresh) {
        //    return datacontext.inventjob.getIncomingJobs(forceRefresh).then(function (data) {
        //        vm.incomingJobs = data;
        //        return vm.incomingJobs;
        //    });
        //}

        //function getJobs(forceRefresh) {
        //    return datacontext.inventjob.getJobs(forceRefresh).then(function (data) {
        //        vm.jobs = data;
        //        return vm.jobs;
        //    });
        //}

      

        function goBack() { $window.history.back(); }

    
    }
})();
