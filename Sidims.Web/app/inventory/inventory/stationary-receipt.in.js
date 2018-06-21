(function () {
    'use strict';
    var controllerId = 'InventStationaryReceiptIN';
    angular
        .module('app')
        .controller('InventStationaryReceiptIN', InventStationaryReceiptIN);

    InventStationaryReceiptIN.$inject = ['$location', 'common', 'datacontext'];

    function InventStationaryReceiptIN($location, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        activate();

        function activate() {
            
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getJobs(forceRefresh) {
            return datacontext.resourcejob.getJobs(forceRefresh).then(function (data) {
                vm.jobs = data;
                //console.log(vm.jobs);
                return vm.jobs;
            });
        }

        function goBack() { $window.history.back(); }

    
    }
})();
