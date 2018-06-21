(function () {
    'use strict';
    var controllerId = 'MISCardClientListIN';
    angular
        .module('app')
        .controller('MISCardClientListIN', MISCardClientListIN);

    MISCardClientListIN.$inject = ['$location', 'common', 'datacontext'];

    function MISCardClientListIN($location, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.clients = [];
        vm.gotoClientDetails = gotoClientDetails;

        activate();

        function activate() {
            var promises = [getClients()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getClients(forceRefresh) {
            return datacontext.inventory.getClients(forceRefresh).then(function (data) {
                vm.clients = data;
                //console.log(vm.clients);
                return vm.clients;
            });
        }

        function gotoClientDetails(entity) {
            //in/mis/card/client/:clientId/product-lists
            if (entity && entity.id) {
                $location.path('/in/mis/card/client/' + entity.id + '/product-lists')
            }
        }





        function getJobs(forceRefresh) {
            return datacontext.resourcejob.getJobs(forceRefresh).then(function (data) {
                vm.jobs = data;
                //console.log(vm.jobs);
                return vm.jobs;
            });
        }

        function gotoJobDetails(entity) {
            if (entity && entity.id) {
                $location.path('/co/job/' + entity.id)
            }
        }

        function goBack() { $window.history.back(); }

    
    }
})();
