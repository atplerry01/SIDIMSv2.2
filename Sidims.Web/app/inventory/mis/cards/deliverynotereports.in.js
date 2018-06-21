(function () {
    'use strict';
    var controllerId = 'MISDeliveryNoteReportsIN';
    angular
        .module('app')
        .controller('MISDeliveryNoteReportsIN', MISDeliveryNoteReportsIN);

    MISDeliveryNoteReportsIN.$inject = ['$location', '$routeParams', 'common', 'config', 'datacontext'];

    function MISDeliveryNoteReportsIN($location, $routeParams, common, config, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;

        vm.deliverynotereports = [];

        activate();

        function activate() {
            
            var promises = [getDeliveryNoteReports()];
            common.activateController(promises, controllerId)
                .then(function () {
                  
                    log('Activated Jobs View');
                });
        }

        function getDeliveryNoteReports(forceRefresh) {
            return datacontext.inventory.AllDeliveryNotes(forceRefresh).then(function (data) {
                vm.deliverynotereports = data;
                //console.log(vm.deliverynotereports);
                return vm.deliverynotereports;
            });
        }



    }
})();
